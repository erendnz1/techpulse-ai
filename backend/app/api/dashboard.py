from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.news import News
from app.models.notification import Notification
from app.schemas.dashboard import DashboardStatsResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_news = db.query(News).count()

    unread_notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read.is_(False),
        )
        .count()
    )

    category_stats = (
        db.query(
            News.category,
            func.count(News.id)
        )
        .group_by(News.category)
        .all()
    )

    categories = {
        category: count
        for category, count in category_stats
        if category
    }

    risk_stats = (
        db.query(
            News.risk_level,
            func.count(News.id)
        )
        .group_by(News.risk_level)
        .all()
    )

    risk_levels = {
        risk_level: count
        for risk_level, count in risk_stats
        if risk_level
    }

    source_stats = (
        db.query(
            News.source,
            func.count(News.id)
        )
        .group_by(News.source)
        .all()
    )

    sources = {
        source: count
        for source, count in source_stats
        if source
    }

    # AI Insights
    ai_articles = categories.get("AI", 0)

    cloud_articles = (
        categories.get("Cloud", 0)
        + categories.get("DevOps", 0)
    )

    critical_alerts = risk_levels.get("Critical", 0)

    top_category = (
        max(categories, key=categories.get)
        if categories
        else None
    )

    top_source = (
        max(sources, key=sources.get)
        if sources
        else None
    )

    return {
        "total_news": total_news,
        "unread_notifications": unread_notifications,

        "categories": categories,
        "risk_levels": risk_levels,
        "sources": sources,

        "ai_articles": ai_articles,
        "cloud_articles": cloud_articles,
        "critical_alerts": critical_alerts,

        "top_category": top_category,
        "top_source": top_source,
    }
