from fastapi import APIRouter
from app.models.notification import Notification
router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.news import News
from fastapi import Depends


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):
    total_news = db.query(News).count()
    unread_notifications = db.query(Notification).filter(
        Notification.is_read.is_(False)
    ).count()
    category_stats = db.query(
        News.category,
        func.count(News.id)
    ).group_by(
       News.category
    ).all()
    risk_stats = db.query(
      News.risk_level,
      func.count(News.id)
    ).group_by(
      News.risk_level
    ).all()
    risk_levels = {
      risk_level: count
      for risk_level, count in risk_stats
    }
    source_stats = db.query(
      News.source,
      func.count(News.id)
    ).group_by(
      News.source
    ).all()
    sources = {
      source: count
      for source, count in source_stats
    }

    categories = {
       category: count
       for category, count in category_stats
    }


    return {
      "total_news": total_news,
      "unread_notifications": unread_notifications,
      "categories": categories,
      "risk_levels": risk_levels,
      "sources": sources
    }