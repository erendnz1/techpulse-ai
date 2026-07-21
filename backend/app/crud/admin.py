from datetime import datetime, timedelta, timezone, UTC
import os

from sqlalchemy import func, text
from sqlalchemy.orm import Session

from app.models.news import News
from app.models.notification import Notification
from app.models.user import User


def normalize_datetime(dt: datetime) -> datetime:
    """Naive ve aware datetime'ları UTC aware hale getirir."""

    if dt is None:
        return datetime.min.replace(tzinfo=timezone.utc)

    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)

    return dt.astimezone(timezone.utc)


def get_recent_activity(db: Session):
    activities = []

    latest_news = (
        db.query(News)
        .order_by(News.created_at.desc())
        .limit(5)
        .all()
    )

    for news in latest_news:
        activities.append(
            {
                "type": "news",
                "title": news.title,
                "created_at": news.created_at,
            }
        )

    latest_users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .limit(5)
        .all()
    )

    for user in latest_users:
        activities.append(
            {
                "type": "user",
                "title": f"{user.username} registered",
                "created_at": user.created_at,
            }
        )

    latest_notifications = (
        db.query(Notification)
        .order_by(Notification.created_at.desc())
        .limit(10)
        .all()
    )

    seen_messages = set()

    for notification in latest_notifications:
        if notification.message in seen_messages:
            continue

        seen_messages.add(notification.message)

        activities.append(
            {
                "type": "notification",
                "title": notification.message,
                "created_at": notification.created_at,
            }
        )

    activities.sort(
        key=lambda item: normalize_datetime(item["created_at"]),
        reverse=True,
    )

    return activities[:10]


def get_dashboard_charts(db: Session):
    last_week = datetime.now(UTC) - timedelta(days=6)

    category_counts = (
        db.query(
            News.category,
            func.count(News.id).label("count"),
        )
        .group_by(News.category)
        .order_by(func.count(News.id).desc())
        .all()
    )

    risk_counts = (
        db.query(
            News.risk_level,
            func.count(News.id).label("count"),
        )
        .filter(
            News.risk_level.isnot(None),
            News.risk_level != "",
        )
        .group_by(News.risk_level)
        .order_by(func.count(News.id).desc())
        .all()
    )

    daily_news = (
        db.query(
            func.date(News.created_at),
            func.count(News.id),
        )
        .filter(News.created_at >= last_week)
        .group_by(func.date(News.created_at))
        .order_by(func.date(News.created_at))
        .all()
    )

    return {
        "categories": [
            {
                "name": category or "Other",
                "value": count,
            }
            for category, count in category_counts
        ],
        "risk_levels": [
            {
                "name": risk,
                "value": count,
            }
            for risk, count in risk_counts
        ],
        "daily_news": [
            {
                "date": date.strftime("%d %b"),
                "count": count,
            }
            for date, count in daily_news
        ],
    }


def get_platform_health_status(db: Session):
    health = {
        "backend": True,
        "database": False,
        "scheduler": True,
        "ai": False,
        "news_sources": 18,
    }

    try:
        db.execute(text("SELECT 1"))
        health["database"] = True
    except Exception:
        health["database"] = False

    health["ai"] = bool(os.getenv("GROQ_API_KEY"))

    return health