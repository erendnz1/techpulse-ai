from sqlalchemy import text
from app.database.base import Base
from app.database.session import engine
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from fastapi import FastAPI
from app.api.news import router as news_router


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
        Base.metadata.create_all(bind=engine)

        print("✅ Database tabloları oluşturuldu.")
    except Exception as e:
        print("❌ Veritabanı bağlantı hatası:")
        print(e)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(news_router)