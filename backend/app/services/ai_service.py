from google import genai
from app.core.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_summary(text: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
Summarize the following technology news in 2-3 sentences.

News:
{text}
"""
    )

    return response.text