from sqlalchemy.orm import Session

from app.models.news import News
from app.models.user_preferences import UserPreferences
from app.crud.notification import (
    create_notification,
    notification_exists,
)
def create_notifications_for_news(
    db: Session,
    news: News
):
    preferences = db.query(UserPreferences).filter(
       UserPreferences.notification_enabled.is_(True)
    ).all()
    for preference in preferences:
        if news.category not in preference.categories:
           continue

        if news.category not in preference.categories:
          continue

        if (
           news.importance_score is None
           or news.importance_score < preference.minimum_importance_score
        ):
          continue

        if notification_exists(
           db=db,
           user_id=preference.user_id,
           news_id=news.id
        ):
         continue

        message = (
           f"New {news.category} news detected: "
           f"{news.title}"
        )

        create_notification(
           db=db,
           user_id=preference.user_id,
           news_id=news.id,
           message=message
        )