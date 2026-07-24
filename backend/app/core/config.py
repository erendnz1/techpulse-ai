from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")            #  Bu dosyanın tek görevi: projenin köküne koyduğun .env dosyasındaki gizli değerleri (API anahtarları, DB bağlantı adresi, şifreler) okuyup Python değişkenlerine çeviriyor.
SECRET_KEY = os.getenv("SECRET_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-3.5-flash"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
AI_PROVIDER = os.getenv("AI_PROVIDER", "groq")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM")
FRONTEND_URL = os.getenv("FRONTEND_URL")
INTERNAL_API_KEY = os.getenv(
    "INTERNAL_API_KEY"
)