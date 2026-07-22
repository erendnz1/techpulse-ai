from datetime import datetime, timedelta, UTC

from sqlalchemy.orm import Session

from app.models.news import News
from app.models.notification import Notification

RETENTION_DAYS = 30


def cleanup_old_news(db: Session):
    cutoff_date = datetime.now(UTC) - timedelta(days=RETENTION_DAYS)

    old_news = (
        db.query(News)
        .filter(News.published_at < cutoff_date)
        .all()
    )

    if not old_news:
        return {
            "deleted_news": 0,
            "deleted_notifications": 0,
        }

    news_ids = [news.id for news in old_news]

    deleted_notifications = (
        db.query(Notification)
        .filter(Notification.news_id.in_(news_ids))
        .delete(synchronize_session=False)
    )

    deleted_news = (
        db.query(News)
        .filter(News.id.in_(news_ids))
        .delete(synchronize_session=False)
    )

    db.commit()

    return {
        "deleted_news": deleted_news,
        "deleted_notifications": deleted_notifications,
    }