import logging
import time
import json
from groq import Groq
from app.core.config import  GROQ_API_KEY
groq_client = Groq(api_key=GROQ_API_KEY)


logger = logging.getLogger(__name__)


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

Return ONLY valid JSON in exactly this format:
{{
    "summary": "A 2-3 sentence summary of the news.",
    "category": "One category from the allowed list"
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
            if response_text:
               result = json.loads(response_text)
               return result

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