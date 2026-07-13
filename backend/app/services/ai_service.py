import logging
import time
import json

from groq import Groq

from app.core.config import GROQ_API_KEY


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
Analyze the following technology news, software release, developer article, or security vulnerability.

Summarize the content in 2-3 sentences.

Choose exactly one category from this list:
- AI
- Security
- Cloud
- DevOps
- Software
-Developer Tools
- Mobile 
- Gaming
- Business
- Other

Rate the importance of the content from 1 to 10:
- 1-3: Low importance
- 4-6: Medium importance
- 7-8: High importance
- 9-10: Critical importance

Choose exactly one risk level from this list:
- Low
- Medium
- High
- Critical

For affected_technologies:
- Identify all explicitly mentioned affected or relevant products, frameworks,
  libraries, platforms, operating systems, services, tools, or technologies.
- For security vulnerabilities, if a named product or technology is affected,
  affected_technologies must not be empty.
- Return affected_technologies as a JSON array of strings.
- If no specific technology is affected or mentioned, return an empty array [].

For recommended_action:
- Provide a clear, concise, and actionable recommendation for software developers
  or IT teams based on the actual content.
- For security vulnerabilities with Medium, High, or Critical risk,
  do not return "No immediate action required."
- Instead, recommend an appropriate action such as applying a security patch,
  upgrading the affected product, reviewing the vendor security advisory,
  restricting access, investigating affected systems, or monitoring for updates.
- If the content genuinely requires no specific action and the risk level is Low,
  return "No immediate action required."

Maintain logical consistency between risk_level and recommended_action.
For is_relevant:
- Return true if the content is relevant to software development, artificial intelligence,
  cybersecurity, cloud computing, DevOps, developer tools, frameworks, libraries,
  operating systems, enterprise technology, mobile technology, or important technology industry developments.
- Return false for unrelated entertainment, movies, celebrities, sports, fossils,
  general politics, or other content without meaningful technology relevance.
- Return only a JSON boolean: true or false.
Return only valid JSON in exactly this format:

{{
    "summary": "A 2-3 sentence summary of the content.",
    "category": "One category from the allowed list",
    "importance_score": 1,
    "risk_level": "Low",
    "affected_technologies": ["Technology 1", "Technology 2"],
    "recommended_action": "A clear and concise recommended action."
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
                category = result.get("category")
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
            ):
                logger.error(
                    "Groq daily quota exhausted. "
                    "Skipping retries for this request."
                )
                return None

            logger.warning(f"Attempt: {attempt + 1}/3")
            logger.warning(
                f"Groq attempt {attempt + 1} failed: {e}"
            )

            if attempt < 2:
                time.sleep(3)

    return None