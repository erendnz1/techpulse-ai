from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import datetime, timedelta, timezone
from app.database.session import get_db
from app.dependencies.auth import admin_required
import os
import tempfile
from app.dependencies.auth import get_current_user
from fastapi.responses import FileResponse

from app.services.report_service import generate_admin_report
from app.models.user import User
from app.models.news import News
from app.models.notification import Notification

from app.schemas.user import UserResponse
from app.schemas.news import NewsResponse

from app.services.news_service import process_and_save_news

from app.crud.admin import (
    get_recent_activity,
    get_dashboard_charts,
    get_platform_health_status,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    total_users = db.query(User).count()
    total_news = db.query(News).count()
    total_notifications = db.query(Notification).count()

    ai_articles = (
        db.query(News)
        .filter(News.category == "AI")
        .count()
    )

    critical_alerts = (
        db.query(News)
        .filter(News.risk_level == "Critical")
        .count()
    )

    return {
        "total_users": total_users,
        "total_news": total_news,
        "total_notifications": total_notifications,
        "ai_articles": ai_articles,
        "critical_alerts": critical_alerts,
    }


@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account.",
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully.",
    }


@router.get("/news", response_model=list[NewsResponse])
def get_admin_news(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return (
        db.query(News)
        .order_by(News.published_at.desc())
        .all()
    )


@router.delete("/news/{news_id}")
def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    news = db.query(News).filter(News.id == news_id).first()

    if news is None:
        raise HTTPException(
            status_code=404,
            detail="News not found.",
        )

    db.delete(news)
    db.commit()

    return {
        "message": "News deleted successfully.",
    }


@router.post("/fetch")
def admin_fetch_news(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    saved_news = process_and_save_news(db)

    return {
        "message": "News fetched successfully.",
        "saved_count": len(saved_news),
    }


@router.get("/activity")
def recent_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return get_recent_activity(db)


@router.get("/charts")
def get_dashboard_charts_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return get_dashboard_charts(db)


@router.get("/health")
def get_platform_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return get_platform_health_status(db)

@router.delete("/cleanup")
def cleanup_old_news(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)

    deleted = (
        db.query(News)
        .filter(
            News.published_at.isnot(None),
            News.published_at < cutoff_date,
        )
        .delete(synchronize_session=False)
    )

    db.commit()

    return {
        "deleted": deleted,
        "message": f"{deleted} old articles removed successfully.",
    }

@router.get("/report")
def download_admin_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    temp_dir = tempfile.gettempdir()

    file_path = os.path.join(
        temp_dir,
        "techpulse_admin_report.pdf",
    )

    generate_admin_report(
        db=db,
        file_path=file_path,
    )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename="TechPulseAI_Report.pdf",
    )

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Admin users cannot be deleted"
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}