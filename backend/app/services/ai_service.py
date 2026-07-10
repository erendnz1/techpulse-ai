import logging
import time
import json
from groq import Groq
from app.core.config import  GROQ_API_KEY

groq_client = Groq(api_key=GROQ_API_KEY)
logger = logging.getLogger(__name__)

ALLOWED_CATEGORIES = {
    "AI",
    "Security",
    "Cloud",
    "DevOps",
    "Software",
    "Mobile",
    "Gaming",
    "Business",
    "Other",
}


def analyze_news(text: str) -> dict | None:
    if not text:
        return None

    prompt = f"""
Analyze the following technology news.

Summarize the news in 2-3 sentences.

Choose exactly one category from this list:
- AI
- Security
- Cloud
- DevOps
- Software
- Mobile
- Gaming
- Business
- Other

Rate the importance of the news from 1 to 10:
- 1-3: Low importance
- 4-6: Medium importance
- 7-8: High importance
- 9-10: Critical importance

Choose exactly one risk level from this list:
- Low
- Medium
- High
- Critical



Return only valid JSON in exactly this format:

{{
    "summary": "A 2-3 sentence summary of the news.",
    "category": "One category from the allowed list",
    "importance_score": 1,
    "risk_level": "Low",
    "affected_technologies": ["Technology 1", "Technology 2"],
    "recommended_action": "A clear and concise recommended action."
}}

Identify the technologies directly affected or mentioned in the news.
Return affected_technologies as a JSON array of strings.
If no specific technology is affected or mentioned, return an empty array [].

Provide a clear and concise recommended action for software developers or IT teams.
If no specific action is required, return "No immediate action required."

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

            if response_text:
                result = json.loads(response_text)

                if not isinstance(result, dict):
                    logger.warning("Groq response is not a valid dictionary.")
                    return None

                summary = result.get("summary")
                category = result.get("category")
                importance_score = result.get("importance_score")
                risk_level = result.get("risk_level")
                affected_technologies = result.get("affected_technologies")
                recommended_action = result.get("recommended_action")
                if not summary:
                    logger.warning("Groq response does not contain a summary.")
                    return None

                if category not in ALLOWED_CATEGORIES:
                    logger.warning(f"Invalid category returned by Groq: {category}")
                    category = "Other"


                if not isinstance(importance_score, int) or not 1 <= importance_score <= 10:
                     logger.warning(f"Invalid importance score returned by Groq: {importance_score}")
                     importance_score = None

                allowed_risk_levels = {"Low", "Medium", "High", "Critical"}

                if risk_level not in allowed_risk_levels:
                     logger.warning(f"Invalid risk level returned by Groq: {risk_level}")
                     risk_level = None    
                
                if not isinstance(affected_technologies, list):
                    logger.warning(
                    f"Invalid affected technologies returned by Groq: {affected_technologies}"
                 )
                affected_technologies = []
 
                if not isinstance(recommended_action, str) or not recommended_action.strip():
                   logger.warning(
                   f"Invalid recommended action returned by Groq: {recommended_action}"
                 )
                recommended_action = "No immediate action required."

                return {
    "summary": summary,
    "category": category,
    "importance_score": importance_score,
    "risk_level": risk_level,
    "affected_technologies": affected_technologies,
    "recommended_action": recommended_action,
}

            logger.warning("Groq returned empty response.")
            return None

        except Exception as e:
            error_message = str(e)

            if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
                logger.error(
                    "Groq daily quota exhausted. Skipping retries for this request."
                )
                return None
            logger.warning(f"Attempt: {attempt + 1}/3")
            logger.warning(f"Groq attempt {attempt + 1} failed: {e}")

            if attempt < 2:
                time.sleep(3)

    return None