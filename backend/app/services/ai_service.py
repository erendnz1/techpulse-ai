import logging
import time
import json
from app.core.exceptions import QuotaExceededError
from groq import Groq
from google import genai
from app.core.config import GROQ_API_KEY, GEMINI_API_KEY, GEMINI_MODEL, AI_PROVIDER

logger = logging.getLogger(__name__)

DEFAULT_BATCH_SIZE = 5


def detect_category(text: str) -> str | None:
    text = text.lower()

    categories = {
        
        "Security": [
            "cve-",
            "zero-day",
            "ransomware",
            "malware",
            "exploit",
            "data breach",
            "vulnerability",
            "privilege escalation",
        ],
        "AI": [
    "openai", "chatgpt", "gpt", "claude", "anthropic",
    "gemini", "llm", "hugging face", "copilot",
    "stable diffusion", "midjourney",

    "google ai",
    "deepmind",
    "vertex ai",
    "veo",
    "imagen",
    "nano banana",
    "perplexity",
    "grok",
    "xai",
],
        "Framework": [
            "react", "next.js", "nextjs", "angular", "vue", "nuxt", "svelte",
            "node.js", "express", "nestjs", "laravel", "symfony", "django",
            "flask", "fastapi", "spring boot", "spring", "asp.net", ".net",
        ],
        "Cloud": [
    "cloudflare",
    "aws",
    "amazon web services",
    "azure",

    "google cloud",
    "gcp",

    "icloud",

    "oracle cloud",

    "serverless",
    "cdn",

    "kubernetes",
    "cloud",
],
        "DevOps": [
            "docker", "terraform", "jenkins", "ansible", "github actions",
            "gitlab ci", "ci/cd", "helm", "argo cd",
        ],
        "Developer Tools": [
            "vs code", "visual studio", "jetbrains", "intellij", "rider",
            "pycharm", "webstorm", "postman", "sdk", "git", "github",
            "npm", "pnpm", "yarn",
        ],
        "Software": [
            "windows", "linux", "macos", "postgresql", "mysql",
            "chrome", "firefox",
        ],
       "Hardware": [
    "cpu",
    "gpu",
    "processor",
    "chip",
    "chips",
    "semiconductor",

    "snapdragon",
    "exynos",
    "mediatek",

    "intel",
    "amd",
    "nvidia",

    "tsmc",
    "micron",
    "sk hynix",

    "ssd",
    "ram",
    "storage",
],
        "Mobile": [
    "android",
    "ios",
    "iphone",
    "ipad",
    "apple watch",

    "samsung",
    "galaxy",

    "xiaomi",
    "redmi",
    "poco",

    "pixel",

    "oneplus",
    "oppo",
    "vivo",
    "huawei",

    "snapdragon",
    "mediatek",
    "play store",
    "app store",
],
        "Gaming": ["steam", "xbox", "playstation", "unity", "unreal"],
        "Business": [
    "acquisition",
    "investment",
    "funding",
    "earnings",
    "revenue",
    "partnership",
    "layoffs",
    "bankruptcy",
    "merger",
    "ipo",
    "restructuring",

    "market share",
    "sales",
    "financial results",
    "quarterly",
],
    }

    scores = {}
    for category, keywords in categories.items():
        score = sum(1 for kw in keywords if kw in text)
        if score:
            scores[category] = score

    if not scores:
        return None

    return max(scores, key=scores.get)


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
    "Hardware",
    "Other",
}
ALLOWED_RISK_LEVELS = {"Low", "Medium", "High", "Critical"}


def validate_result(result: dict, text: str) -> dict | None:
    if not isinstance(result, dict):
        return None

    summary = result.get("summary")
    if not summary:
        return None

    category = result.get("category")

    if category not in ALLOWED_CATEGORIES:
      category = detect_category(text) or "Other"

    importance_score = result.get("importance_score")
    if not isinstance(importance_score, int) or not 1 <= importance_score <= 10:
        importance_score = 6

    risk_level = result.get("risk_level")
    if risk_level not in ALLOWED_RISK_LEVELS:
        risk_level = "Low"

    affected_technologies = result.get("affected_technologies")
    if not isinstance(affected_technologies, list):
        affected_technologies = []
    else:
        affected_technologies = [t for t in affected_technologies if isinstance(t, str)]

    recommended_action = result.get("recommended_action")
    if not isinstance(recommended_action, str) or not recommended_action.strip():
        recommended_action = "No immediate action required."

    is_relevant = result.get("is_relevant")
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


# ---------------------------------------------------------------------------
# Prompt
# ---------------------------------------------------------------------------

_RULES_BLOCK = """Analyze the tech news articles below. Return ONLY a valid JSON object, with no markdown, comments, or explanations, in exactly this format:

{
  "results": [
    { ... article 0 ... },
    { ... article 1 ... }
  ]
}

The "results" array must contain exactly the same number of objects as the input articles, in the same order.

For each article, generate:

- summary
- category
- importance_score
- risk_level
- affected_technologies
- recommended_action
- is_relevant

Importance Score (1-10):

1-2 = Minor announcements, small fixes, or maintenance updates.
3-4 = Routine product updates, blog posts, tutorials, or documentation.
5-6 = Standard framework, library, cloud, AI, mobile, or developer tool updates.
7 = Major product releases, significant new features, or important technology announcements.
8 = Industry-wide impact affecting many developers or organizations.
9 = Critical security incident, severe vulnerability, or major platform outage.
10 = Global emergency or technology event with worldwide impact.

Most articles should receive scores between 5 and 7.
Assign scores of 8-10 only when the impact is truly exceptional.
Do NOT assign a high importance score solely because an article is related to cybersecurity.

Risk Level:

- Low = General announcements, releases, tutorials, product updates, framework updates, AI news, cloud news, or developer tool updates.
- Medium = Security vulnerabilities or issues that require attention but are not actively exploited.
- High = Confirmed exploitation, severe vulnerabilities, or incidents requiring immediate action.
- Critical = Large-scale actively exploited security incidents with widespread impact.

Only security-related articles may receive High or Critical risk.
All non-security articles should receive Low risk.

Affected Technologies:

Return a list of technologies directly mentioned in the article.
Examples:
["React", "Next.js"]
["Docker", "Kubernetes"]
["AWS"]
Return an empty array if none are explicitly mentioned.

Recommended Action:

Provide one concise recommendation (maximum one sentence).
Leave it empty if no action is required.

is_relevant:

Return true only if the article is useful for software developers, DevOps engineers, cloud engineers, security professionals, AI engineers, or other IT professionals.

Each object inside "results" must follow exactly this schema:

{
  "summary": "2-3 sentence summary",
  "importance_score": 6,
  "risk_level": "Low",
  "category": "Mobile",
  "affected_technologies": [],
  "recommended_action": "",
  "is_relevant": true
}
"""


def build_batch_prompt(texts: list[str]) -> str:
    numbered = "\n\n".join(f"[Article {i}]\n{t}" for i, t in enumerate(texts))
    return f"{_RULES_BLOCK}\n\nArticles ({len(texts)} total):\n\n{numbered}\n\nReturn the JSON object with a \"results\" array of exactly {len(texts)} items."


def _chunk(items: list, size: int) -> list[list]:
    return [items[i:i + size] for i in range(0, len(items), size)]


# ---------------------------------------------------------------------------
# Groq
# ---------------------------------------------------------------------------

def _analyze_groq_batch_call(texts: list[str]) -> list[dict | None] | None:
    """Tek bir Groq isteğinde bir batch'i analiz eder. Başarısız olursa None döner."""
    if not GROQ_API_KEY:
        logger.error("GROQ_API_KEY is missing.")
        return None

    groq_client = Groq(api_key=GROQ_API_KEY)
    prompt = build_batch_prompt(texts)

    for attempt in range(3):
        logger.info(f"Groq batch attempt {attempt + 1} ({len(texts)} articles)")

        try:
            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                max_tokens=250 * len(texts),
            )

            response_text = response.choices[0].message.content
            if not response_text:
                logger.warning("Groq returned empty response.")
                return None

            parsed_obj = json.loads(response_text)

            if not isinstance(parsed_obj, dict):
                logger.warning(f"Groq batch response is not a JSON object: {response_text}")
                return None

            parsed = parsed_obj.get("results")

            if not isinstance(parsed, list):
                logger.warning(f"Groq batch response has no 'results' array: {response_text}")
                return None

            if len(parsed) != len(texts):
                logger.warning(
                    f"Groq batch size mismatch: sent {len(texts)}, got {len(parsed)}"
                )
                # Eksik/fazla gelirse elimizdeki kadarını eşleştir, kalanı None bırak.

            results: list[dict | None] = []
            for i, text in enumerate(texts):
                item = parsed[i] if i < len(parsed) else None
                results.append(validate_result(item, text) if item else None)

            return results

        except json.JSONDecodeError:
            logger.warning("Groq returned invalid JSON for batch.")
        except Exception as e:
            error_message = str(e)
            logger.error(f"Groq batch call failed: {e!r}")

            if (
                "RESOURCE_EXHAUSTED" in error_message
                or "429" in error_message
                or "quota" in error_message.lower()
            ):
                logger.error("Groq daily quota exhausted.")
                raise QuotaExceededError()

        if attempt < 2:
            time.sleep(3)

    return None


def analyze_groq_batch(texts: list[str], batch_size: int = DEFAULT_BATCH_SIZE) -> list[dict | None]:
    """Makale listesini batch'lere bölüp her batch için tek istek atar."""
    all_results: list[dict | None] = []

    for chunk in _chunk(texts, batch_size):
        chunk_results = _analyze_groq_batch_call(chunk)
        if chunk_results is None:
            all_results.extend([None] * len(chunk))
        else:
            all_results.extend(chunk_results)

    return all_results


# ---------------------------------------------------------------------------
# Gemini
# ---------------------------------------------------------------------------

def _analyze_gemini_batch_call(texts: list[str]) -> list[dict | None] | None:
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY is missing.")
        return None

    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    prompt = build_batch_prompt(texts)

    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config={"response_mime_type": "application/json"},
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

        parsed_obj = json.loads(response_text)

        if not isinstance(parsed_obj, dict):
            logger.warning(f"Gemini batch response is not a JSON object: {response_text}")
            return None

        parsed = parsed_obj.get("results")

        if not isinstance(parsed, list):
            logger.warning(f"Gemini batch response has no 'results' array: {response_text}")
            return None

        if len(parsed) != len(texts):
            logger.warning(
                f"Gemini batch size mismatch: sent {len(texts)}, got {len(parsed)}"
            )

        results: list[dict | None] = []
        for i, text in enumerate(texts):
            item = parsed[i] if i < len(parsed) else None
            results.append(validate_result(item, text) if item else None)

        return results

    except Exception as e:
        error_message = str(e)
        if (
            "RESOURCE_EXHAUSTED" in error_message
            or "429" in error_message
            or "quota" in error_message.lower()
        ):
            logger.error("Gemini daily quota exhausted.")
            raise QuotaExceededError()

        logger.error(f"Gemini batch error: {e!r}")
        return None


def analyze_gemini_batch(texts: list[str], batch_size: int = DEFAULT_BATCH_SIZE) -> list[dict | None]:
    all_results: list[dict | None] = []

    for chunk in _chunk(texts, batch_size):
        chunk_results = _analyze_gemini_batch_call(chunk)
        if chunk_results is None:
            all_results.extend([None] * len(chunk))
        else:
            all_results.extend(chunk_results)

    return all_results


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def analyze_news_batch(texts: list[str], batch_size: int = DEFAULT_BATCH_SIZE) -> list[dict | None]:
    """Birden fazla makaleyi mümkün olan en az istekle analiz eder.

    Dönen liste, girdi listesiyle aynı sırada ve aynı uzunluktadır.
    Analiz edilemeyen makaleler için ilgili index None olur.
    """
    logger.info(f"Active provider: {AI_PROVIDER}")

    if not texts:
        return []

    provider = (AI_PROVIDER or "").lower()

    if provider == "groq":
        return analyze_groq_batch(texts, batch_size=batch_size)

    if provider == "gemini":
        return analyze_gemini_batch(texts, batch_size=batch_size)

    logger.error(f"Unsupported AI provider: {AI_PROVIDER}")
    return [None] * len(texts)


def analyze_news(text: str) -> dict | None:
    """Geriye dönük uyumluluk için tekil makale analizi.
    İç mekanizması batch fonksiyonunu 1 elemanlı liste ile çağırır.
    Çok sayıda makale işleyecekseniz analyze_news_batch kullanın —
    her çağrı ayrı bir istek harcar ve günlük kotayı hızlı tüketir.
    """
    if not text:
        return None

    results = analyze_news_batch([text], batch_size=1)
    return results[0] if results else None
