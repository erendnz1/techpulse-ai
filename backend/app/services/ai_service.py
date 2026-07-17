import logging
import time
import json
from app.core.exceptions import QuotaExceededError
from groq import Groq

from app.core.config import GROQ_API_KEY

def detect_category(text: str) -> str | None:
    text = text.lower()

    categories = {
        "AI": [
            "openai", "chatgpt", "gpt", "claude", "anthropic",
            "gemini", "llm", "hugging face", "copilot",
            "stable diffusion", "midjourney"
        ],

        "Cloud": [
            "cloudflare", "aws", "amazon web services",
            "azure", "google cloud", "gcp",
            "kubernetes", "serverless",
            "cdn", "cloud"
        ],

        "DevOps": [
            "docker", "terraform", "jenkins",
            "ansible", "github actions",
            "gitlab ci", "ci/cd", "helm",
            "argo cd"
        ],

        "Developer Tools": [
            "vs code", "visual studio",
            "jetbrains", "intellij",
            "postman", "sdk"
        ],

        "Software": [
            "react", "next.js", "angular",
            "vue", "windows", "linux",
            "macos", "postgresql",
            "mysql", "chrome",
            "firefox"
        ],

        "Mobile": [
            "android", "ios",
            "iphone", "ipad",
            "play store", "app store"
        ],

        "Gaming": [
            "steam", "xbox",
            "playstation", "unity",
            "unreal"
        ],

        "Business": [
            "acquisition", "investment",
            "funding", "earnings",
            "revenue", "partnership",
            "layoffs"
        ],

        "Security": [
            "cve-",
            "zero-day",
            "ransomware",
            "malware",
            "exploit",
            "data breach"
        ]
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
logger = logging.getLogger(__name__)


ALLOWED_CATEGORIES = {
    "AI",
    "Security",
    "Cloud",
    "DevOps",
    "Software",
    "Developer Tools",
    "Mobile",
    "Gaming",
    "Business",
    "Other"
}


def analyze_news(text: str) -> dict | None:
    

    if not text:
        return None

   
    prompt = f"""
You are an expert technology news analyst.

Analyze the following news article.

TASKS:

1. Write a concise summary in 2-3 sentences.

2. Choose EXACTLY ONE category from:

- AI
- Security
- Cloud
- DevOps
- Software
- Developer Tools
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
- IntelliJ
- JetBrains
- Git
- GitHub
- npm
- Programming frameworks
- SDK
- API

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
→ Software

Android 17 Beta
→ Mobile

Microsoft acquires company
→ Business

CVE-2026-12345
→ Security

3. Rate importance from 1-10.

4. Risk level:
Low
Medium
High
Critical

Only Security news should normally receive High or Critical risk.

5. affected_technologies:
Return a JSON array.

6. recommended_action:
Provide one actionable recommendation.

7. is_relevant:
Return true or false.

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

News:

{text}
"""
    for attempt in range(3):
        logger.info(f"Starting attempt {attempt + 1}")

        try:
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

            response_text = response.choices[0].message.content

            if response_text:
             result = json.loads(response_text)

            if response_text:
                try:
                   result = json.loads(response_text)
                except json.JSONDecodeError:
                  logger.warning(
                  f"Groq returned invalid JSON: {response_text}"
                )
                  raise 

                if not isinstance(result, dict):
                    logger.warning(
                        "Groq response is not a valid dictionary."
                    )
                    return None
 
                summary = result.get("summary")
                rule_category = detect_category(text)

                if rule_category:
                  category = rule_category
                else:
                  category = result.get("category", "Other")
                importance_score = result.get("importance_score")
                risk_level = result.get("risk_level")
                affected_technologies = result.get(
                    "affected_technologies"
                )
                recommended_action = result.get(
                    "recommended_action"
                )
                is_relevant = result.get("is_relevant")

                if not summary:
                    logger.warning(
                        "Groq response does not contain a summary."
                    )
                    return None

                if category not in ALLOWED_CATEGORIES:
                    logger.warning(
                        f"Invalid category returned by Groq: {category}"
                    )
                    category = "Other"

                if (
                    not isinstance(importance_score, int)
                    or not 1 <= importance_score <= 10
                ):
                    logger.warning(
                        f"Invalid importance score returned by Groq: "
                        f"{importance_score}"
                    )
                    importance_score = None

                allowed_risk_levels = {
                    "Low",
                    "Medium",
                    "High",
                    "Critical",
                }

                if risk_level not in allowed_risk_levels:
                    logger.warning(
                        f"Invalid risk level returned by Groq: "
                        f"{risk_level}"
                    )
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
                    recommended_action = (
                        "No immediate action required."
                    )
                if not isinstance(is_relevant, bool):
                   logger.warning(
                   f"Invalid is_relevant returned by Groq: {is_relevant}"
                   )
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

            logger.warning("Groq returned empty response.")
            return None

        except Exception as e:
            error_message = str(e)

            if (
             "RESOURCE_EXHAUSTED" in error_message
              or "429" in error_message
              or "quota" in error_message.lower()
            ):
              logger.error("Groq daily quota exhausted.")
              raise QuotaExceededError()

            logger.warning(f"Attempt: {attempt + 1}/3")
            logger.warning(
             f"Groq attempt {attempt + 1} failed: {e}"
            )

            if attempt < 2:
             time.sleep(3)

            logger.warning(f"Attempt: {attempt + 1}/3")
            logger.warning(
                f"Groq attempt {attempt + 1} failed: {e}"
            )

            if attempt < 2:
                time.sleep(3)

    return None