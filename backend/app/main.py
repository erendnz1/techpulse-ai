from sqlalchemy import text

from app.database.session import engine

from fastapi import FastAPI


app = FastAPI(
    title="TechPulse AI API",
    version="1.0.0",
    description="AI-powered software technology monitoring platform"
)

@app.get("/")
def root():
    return {
        "project": "TechPulse AI",
        "version": "1.0.0",
        "status": "Running 🚀",
        "message": "Welcome to TechPulse AI API"
    }

@app.on_event("startup")
def startup():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("✅ PostgreSQL bağlantısı başarılı.")
    except Exception as e:
        print("❌ Veritabanı bağlantı hatası:")
        print(e)