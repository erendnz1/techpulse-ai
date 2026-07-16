from sqlalchemy.orm import Session
from app.schemas.user_preferences import (
    UserPreferencesCreate,
    UserPreferencesUpdate,
)
from app.models.user_preferences import UserPreferences


def get_user_preferences(
    db: Session,
    user_id: int
):
    return (
        db.query(UserPreferences)
        .filter(UserPreferences.user_id == user_id)
        .first()
    )

def create_user_preferences(
    db: Session,
    user_id: int,
    preferences: UserPreferencesCreate
):
    db_preferences = UserPreferences(
    user_id=user_id,
    categories=preferences.categories,
    regions=preferences.regions,
    minimum_importance_score=preferences.minimum_importance_score,
    notification_enabled=preferences.notification_enabled,
    email_notification_enabled=preferences.email_notification_enabled,
)

    db.add(db_preferences)
    db.commit()
    db.refresh(db_preferences)

    return db_preferences

def update_user_preferences(
    db: Session,
    db_preferences: UserPreferences,
    preferences: UserPreferencesUpdate
):
    update_data = preferences.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_preferences, field, value)

    db.commit()
    db.refresh(db_preferences)

    return db_preferences