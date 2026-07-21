from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database.base import Base
from app.database.session import engine
from app.models.user import User
from app.models.news import News
from app.models.user_preferences import UserPreferences
from app.models.notification import Notification
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.news import router as news_router
from app.api.user_preferences import router as preferences_router
from app.services.scheduler_service import scheduler
from app.api.notifications import router as notifications_router
from app.api.dashboard import router as dashboard_router
from app.api.admin import router as admin_router
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        print("✅ PostgreSQL bağlantısı başarılı.")

        Base.metadata.create_all(bind=engine)

        print("✅ Database tabloları oluşturuldu.")

        if not scheduler.running:
            scheduler.start()
            print("✅ News scheduler başlatıldı.")

        for job in scheduler.get_jobs():
            print(f"📅 Scheduler job: {job.id}")
            print(f"⏰ Next run time: {job.next_run_time}")

    except Exception as e:
        print("❌ Uygulama başlatma hatası:")
        print(e)

    yield

    if scheduler.running:
        scheduler.shutdown()
        print("🛑 News scheduler durduruldu.")

app = FastAPI(
    title="TechPulse AI API",
    version="1.0.0",
    description="AI-powered software technology monitoring platform",
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "project": "TechPulse AI",
        "version": "1.0.0",
        "status": "Running 🚀",
        "message": "Welcome to TechPulse AI API"
    }


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(news_router)
app.include_router(preferences_router) 
app.include_router(notifications_router)
app.include_router(dashboard_router)
app.include_router(admin_router)