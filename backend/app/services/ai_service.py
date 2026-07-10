import logging
import time

from google import genai

from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

client = genai.Client(api_key=GEMINI_API_KEY)

logger = logging.getLogger(__name__)


def generate_summary(text: str) -> str | None:
    if not text:
        return None

    prompt = f"""
Summarize the following technology news in 2-3 sentences.

News:
{text}
"""
    
    for attempt in range(3):
        logger.info(f"Starting attempt {attempt + 1}")
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            logger.info(f"Response: {response}")
            logger.info(f"Response Text: {response.text}")
            logger.info(f"Candidates: {response.candidates}")
            if response.text:
                return response.text.strip()

            logger.warning("Gemini returned empty response.")
            return None

        except Exception as e:
            error_message = str(e)

            if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
                logger.error(
                    "Gemini daily quota exhausted. Skipping retries for this request."
                )
                return None
            logger.warning(f"Attempt: {attempt + 1}/3")
            logger.warning(f"Gemini attempt {attempt + 1} failed: {e}")

            if attempt < 2:
                time.sleep(3)

    return None