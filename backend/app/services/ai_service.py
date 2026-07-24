import logging
import time
import json
from app.core.exceptions import QuotaExceededError
from groq import Groq
from google import genai
from app.core.config import GROQ_API_KEY, GEMINI_API_KEY, GEMINI_MODEL, AI_PROVIDER


def detect_category(text: str) -> str | None:
    text = text.lower()

    categories = {
        "AI": [
            "openai",
            "chatgpt",
            "gpt",
            "claude",
            "anthropic",
            "gemini",
            "llm",
            "hugging face",
            "copilot",
            "stable diffusion",
            "midjourney",
        ],
        "Cloud": [
            "cloudflare",
            "aws",
            "amazon web services",
            "azure",
            "google cloud",
            "gcp",
            "kubernetes",
            "serverless",
            "cdn",
            "cloud",
        ],
        "DevOps": [
            "docker",
            "terraform",
            "jenkins",
            "ansible",
            "github actions",
            "gitlab ci",
            "ci/cd",
            "helm",
            "argo cd",
        ],
        "Developer Tools": [
            "vs code",
            "visual studio",
            "jetbrains",
            "intellij",
            "postman",
            "sdk",
        ],
        "Software": [
            "react",
            "next.js",
            "angular",
            "vue",
            "windows",
            "linux",
            "macos",
            "postgresql",
            "mysql",
            "chrome",
            "firefox",
        ],
        "Mobile": ["android", "ios", "iphone", "ipad", "play store", "app store"],
        "Gaming": ["steam", "xbox", "playstation", "unity", "unreal"],
        "Business": [
            "acquisition",
            "investment",
            "funding",
            "earnings",
            "revenue",
            "partnership",
            "layoffs",
        ],
        "Security": [
            "cve-",
            "zero-day",
            "ransomware",
            "malware",
            "exploit",
            "data breach",
        ],
    }

    scores = {}

    for category, keywords in categories.items():
        score = 0

        for keyword in keywords:
            if keyword in text:
                score += 1

        if score:
            scores[category] = score

    if not scores:
        return None

    return max(scores, key=scores.get)


groq_client = Groq(api_key=GROQ_API_KEY)
gemini_client = genai.Client(api_key=GEMINI_API_KEY)
logger = logging.getLogger(__name__)


ALLOWED_CATEGORIES = {
    "AI",
    "Security",
    "Framework",
    "Developer Tools",
    "Cloud",
    "DevOps",
    "Software",
    "Mobile",
    "Gaming",
    "Business",
    "Other",
}


def build_prompt(text: str) -> str:
    return f"""
    You are an expert technology news analyst.

Analyze the following news article.

TASKS:

1. Write a concise summary in 2-3 sentences.

2. Choose EXACTLY ONE category from:

- AI
- Security
- Framework
- Developer Tools
- Cloud
- DevOps
- Software
- Mobile
- Gaming
- Business
- Other

CATEGORY RULES (VERY IMPORTANT):

AI
- OpenAI
- Anthropic
- Google Gemini
- ChatGPT
- Claude
- LLMs
- Machine Learning
- Artificial Intelligence

Security
- CVE
- Vulnerability
- Malware
- Ransomware
- Data breach
- Cyber attack
- Security patch
- Authentication
- Encryption
Security also includes:

- Vulnerability research
- Exploit write-ups
- Reverse engineering of attacks
- Privilege escalation techniques
- Security bypass techniques
- Threat intelligence
- Incident response
- Digital forensics
- Malware analysis
- Security research papers
Cloud
- AWS
- Azure
- Google Cloud
- Cloudflare
- Kubernetes
- Containers
- Infrastructure
- CDN

DevOps
- Docker
- CI/CD
- Jenkins
- GitHub Actions
- Terraform
- Monitoring
- Deployment
- Infrastructure automation

Developer Tools

- Visual Studio
- VS Code
- IntelliJ IDEA
- Rider
- PyCharm
- WebStorm
- JetBrains IDEs
- Git
- GitHub
- npm
- pnpm
- Yarn
- SDK
- API

Framework

- React
- Next.js
- Angular
- Vue
- Nuxt
- Svelte
- Node.js
- Express
- NestJS
- Laravel
- Symfony
- Django
- Flask
- FastAPI
- Spring
- Spring Boot
- ASP.NET
- .NET

Software
- Windows
- Linux
- macOS
- React
- Next.js
- Angular
- Vue
- Firefox
- Chrome
- PostgreSQL
- MySQL
- General software releases
IMPORTANT

Software is for general software products, operating systems, browsers,
databases and normal software releases.

Choose Software only if the primary subject is a software feature,
release, compatibility update or product improvement.

Do NOT choose Software for:

- Vulnerability research
- Exploit techniques
- Privilege escalation
- Malware analysis
- Security bypasses
- Penetration testing
- Security research
- Attack techniques

These belong to Security.
Mobile
- Android
- iOS
- Smartphones
- Mobile applications

Gaming
- Xbox
- PlayStation
- Steam
- Unreal Engine
- Unity
- Game releases

Business
- Company acquisitions
- Financial results
- Investments
- Layoffs
- Partnerships
- Market announcements

IMPORTANT:

Choose Security ONLY if the primary subject is cybersecurity or a security vulnerability.

Do NOT classify news as Security simply because security is mentioned.

Examples:

Cloudflare launches new AI bot detection
→ Cloud

OpenAI releases GPT update
→ AI

VS Code 1.108 released
→ Developer Tools

React 20 RC announced
→ Framework

Android 17 Beta
→ Mobile

Microsoft acquires company
→ Business

CVE-2026-12345
→ Security
Next.js 17 Released
→ Framework

Angular 21 Released
→ Framework

Laravel 13 Released
→ Framework

Spring Boot 4 Released
→ Framework

Visual Studio 2026 Released
→ Developer Tools

Visual Studio Code 1.112 Released
→ Developer Tools
3. Rate the importance from 1-10 using these STRICT rules.

Importance Scale

1-2
Minor update, typo fix, documentation update, small bug fix.

3-4
Routine feature update, small product improvement, regular release.

5
Useful news for developers but not important for most users.

6
Important update that many developers should know about.

7
Major release or significant new feature that impacts a large community.

8
Industry-wide important announcement, major framework release, significant AI model release, major cloud platform update.

9
Critical industry event, actively exploited vulnerability, major security incident, breaking technology announcement.

10
Global emergency, zero-day vulnerability affecting millions, catastrophic outage, or an event with worldwide impact.

VERY IMPORTANT

Do NOT give every article 8.

Most articles should receive scores between 4 and 7.

Only exceptional articles should receive 8 or higher.
SCORING GUIDELINES

The importance score must reflect how significant the news is for the global software industry.

Use the FULL scale from 1 to 10.

Typical distribution across technology news:

- 1-2 : Very rare
- 3-4 : Common updates
- 5-6 : Most technology news
- 7 : Major releases
- 8 : Very important industry announcements
- 9 : Rare critical events
- 10 : Extremely rare global impact
CATEGORY EXAMPLES

AI
- Minor model improvement -> 5
- New GPT flagship model -> 8
- Breakthrough AI technology -> 9

Framework
- Patch release -> 4
- Major version release -> 7
- Revolutionary framework feature -> 8

Developer Tools
- Small IDE update -> 4
- Major Visual Studio release -> 6
- Important GitHub feature -> 7

Cloud
- Minor AWS feature -> 5
- New AWS service -> 7
- Global cloud outage -> 9

Security
- Routine security advisory -> 5
- Important security patch -> 7
- Actively exploited CVE -> 9
- Worldwide zero-day emergency -> 10

Business
- Small investment -> 4
- Large acquisition -> 7
- Industry-changing acquisition -> 8

Mobile
- Beta release -> 5
- Stable major OS release -> 7

Gaming
- Regular game update -> 4
- New console announcement -> 8
Never assign 8, 9 or 10 unless the article would likely be discussed by most software engineers or security teams worldwide.
Be conservative when assigning high importance scores.

If you are uncertain between two scores, choose the lower one.

Avoid score inflation.
CATEGORY-SPECIFIC LIMITS

Gaming news should rarely score above 6.

Business news should rarely score above 7 unless it fundamentally changes the technology industry.

Routine AI announcements should score between 5 and 7.

Only major AI model releases should receive 8 or higher.

Routine cloud, framework and developer tool updates should usually score between 5 and 7.

Only globally significant technology announcements should receive 8 or higher.
Most articles are not exceptional. Use scores 8-10 only when clearly justified by the article.
4. Risk level:
Low
Medium
High
Critical

Risk Level Rules

Low
Routine updates, releases, announcements.

Medium
Important changes that may require attention but are not urgent.

High
Confirmed vulnerabilities, security patches, active attacks, important infrastructure incidents.

Critical
Actively exploited zero-day vulnerabilities, ransomware outbreaks, massive data breaches, emergency security issues.

Non-security news should almost always have Low risk.

5. affected_technologies:
Return a JSON array.

6. recommended_action:
Provide one actionable recommendation.

7. is_relevant:
Return true or false.
Return false if the article is NOT primarily relevant to software engineers,
IT professionals, DevOps teams, cybersecurity professionals or developers.

Examples of irrelevant news:

- Consumer product rumors
- Aviation news
- Car launches
- Smartphone pricing
- Gaming reviews
- General business news unrelated to software
- Entertainment
- Lifestyle
- Politics

Only return true if the article provides useful information for software professionals.
IMPORTANT

Return ONLY valid JSON.

Do not include markdown.

Do not include explanations.

Do not wrap JSON inside code blocks.

Every field must be filled.
Return ONLY valid JSON:

{{
    "summary": "...",
    "category": "...",
    "importance_score": 1,
    "risk_level": "...",
    "affected_technologies": [],
    "recommended_action": "...",
    "is_relevant": true
}}

News:{text}
"""


def analyze_groq(text: str) -> dict | None:

    prompt = build_prompt(text)

    for attempt in range(3):

        logger.info(f"Starting attempt {attempt + 1}")

        try:
            print("MODEL:", "llama-3.3-70b-versatile")
            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
            )

            response_text = response.choices[0].message.content

            if not response_text:
                logger.warning("Groq returned empty response.")
                return None

            try:
                result = json.loads(response_text)
            except json.JSONDecodeError:
                logger.warning(f"Groq returned invalid JSON: {response_text}")
                raise

            if not isinstance(result, dict):
                logger.warning("Groq response is not a valid dictionary.")
                return None

            summary = result.get("summary")
            rule_category = detect_category(text)

            if rule_category:
                category = rule_category
            else:
                category = result.get("category", "Other")
            importance_score = result.get("importance_score")
            risk_level = result.get("risk_level")
            affected_technologies = result.get("affected_technologies")
            recommended_action = result.get("recommended_action")
            is_relevant = result.get("is_relevant")

            if not summary:
                logger.warning("Groq response does not contain a summary.")
                return None

            if category not in ALLOWED_CATEGORIES:
                logger.warning(f"Invalid category returned by Groq: {category}")
                category = "Other"

            if not isinstance(importance_score, int) or not 1 <= importance_score <= 10:
                logger.warning(
                    f"Invalid importance score returned by Groq: " f"{importance_score}"
                )
                importance_score = None

            allowed_risk_levels = {
                "Low",
                "Medium",
                "High",
                "Critical",
            }

            if risk_level not in allowed_risk_levels:
                logger.warning(f"Invalid risk level returned by Groq: " f"{risk_level}")
                risk_level = None

            if not isinstance(affected_technologies, list):
                logger.warning(
                    f"Invalid affected technologies returned by Groq: "
                    f"{affected_technologies}"
                )
                affected_technologies = []

            if (
                not isinstance(recommended_action, str)
                or not recommended_action.strip()
            ):
                logger.warning(
                    f"Invalid recommended action returned by Groq: "
                    f"{recommended_action}"
                )
                recommended_action = "No immediate action required."
            if not isinstance(is_relevant, bool):
                logger.warning(f"Invalid is_relevant returned by Groq: {is_relevant}")
                is_relevant = True
            return {
                "summary": summary,
                "category": category,
                "importance_score": importance_score,
                "risk_level": risk_level,
                "affected_technologies": affected_technologies,
                "recommended_action": recommended_action,
                "is_relevant": is_relevant,
            }

        except Exception as e:
            print("FULL ERROR:", repr(e))
            error_message = str(e)

            if (
                "RESOURCE_EXHAUSTED" in error_message
                or "429" in error_message
                or "quota" in error_message.lower()
            ):
                logger.error("Groq daily quota exhausted.")
                raise QuotaExceededError()

            logger.warning(f"Attempt: {attempt + 1}/3")
            logger.warning(f"Groq attempt {attempt + 1} failed: {e}")

            if attempt < 2:
                time.sleep(3)
    return None


def analyze_gemini(text: str) -> dict | None:

    prompt = build_prompt(text)

    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        if not response.text:
            logger.warning("Gemini returned empty response.")
            return None

        response_text = response.text.strip()

        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "", 1)

        if response_text.endswith("```"):
            response_text = response_text[:-3]

        response_text = response_text.strip()

        result = json.loads(response_text)

        if not isinstance(result, dict):
            logger.warning("Gemini response is not a valid dictionary.")
            return None

        summary = result.get("summary")

        rule_category = detect_category(text)

        if rule_category:
            category = rule_category
        else:
            category = result.get("category", "Other")

        importance_score = result.get("importance_score")
        risk_level = result.get("risk_level")
        affected_technologies = result.get("affected_technologies")
        recommended_action = result.get("recommended_action")
        is_relevant = result.get("is_relevant")

        if not summary:
            return None

        if category not in ALLOWED_CATEGORIES:
            category = "Other"

        if not isinstance(importance_score, int) or not 1 <= importance_score <= 10:
            importance_score = None

        if risk_level not in {"Low", "Medium", "High", "Critical"}:
            risk_level = None

        if not isinstance(affected_technologies, list):
            affected_technologies = []

        if not isinstance(recommended_action, str) or not recommended_action.strip():
            recommended_action = "No immediate action required."

        if not isinstance(is_relevant, bool):
            is_relevant = True

        return {
            "summary": summary,
            "category": category,
            "importance_score": importance_score,
            "risk_level": risk_level,
            "affected_technologies": affected_technologies,
            "recommended_action": recommended_action,
            "is_relevant": is_relevant,
        }

    except Exception as e:
        logger.error(f"Gemini error: {e}")
        return None


def analyze_news(text: str) -> dict | None:
    print("ACTIVE PROVIDER:", AI_PROVIDER)
    if not text:
        return None

    if AI_PROVIDER.lower() == "groq":
        return analyze_groq(text)

    if AI_PROVIDER.lower() == "gemini":
        return analyze_gemini(text)

    raise ValueError(f"Unsupported AI provider: {AI_PROVIDER}")
