from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.news import NewsResponse
from sqlalchemy import func
from app.schemas.user import UserResponse
from app.database.session import get_db
from app.dependencies.auth import admin_required
from app.models.user import User
from app.models.news import News
from app.models.notification import Notification
from fastapi import HTTPException
router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)
@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):

    total_users = db.query(User).count()

    total_news = db.query(News).count()

    total_notifications = db.query(Notification).count()

    ai_articles = db.query(News).filter(
        News.category == "AI"
    ).count()

    critical_alerts = db.query(News).filter(
        News.risk_level == "Critical"
    ).count()

    return {
        "total_users": total_users,
        "total_news": total_news,
        "total_notifications": total_notifications,
        "ai_articles": ai_articles,
        "critical_alerts": critical_alerts
    }
from app.services.news_service import process_and_save_news
@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account."
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully."
    }

@router.get("/news", response_model=list[NewsResponse])
def get_all_news(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
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
    current_user: User = Depends(admin_required)
):
    news = db.query(News).filter(
        News.id == news_id
    ).first()

    if news is None:
        raise HTTPException(
            status_code=404,
            detail="News not found."
        )

    db.delete(news)
    db.commit()

    return {
        "message": "News deleted successfully."
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