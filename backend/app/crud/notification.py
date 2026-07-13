from sqlalchemy.orm import Session

from app.models.notification import Notification

def create_notification(
    db: Session,
    user_id: int,
    news_id: int,
    message: str
):
    notification = Notification(
      user_id=user_id,
      news_id=news_id,
      message=message
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification

def get_user_notifications(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    unread_only: bool = False
):
    query = db.query(Notification).filter(
        Notification.user_id == user_id
    )

    if unread_only:
        query = query.filter(
            Notification.is_read.is_(False)
        )

    return query.order_by(
        Notification.created_at.desc()
    ).offset(skip).limit(limit).all()

def notification_exists(
    db: Session,
    user_id: int,
    news_id: int
):
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.news_id == news_id
    ).first() is not None

def mark_notification_as_read(
    db: Session,
    notification_id: int,
    user_id: int
):
    notification = db.query(Notification).filter(
       Notification.id == notification_id,
       Notification.user_id == user_id
    ).first()

    if notification is None:
       return None
    
    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification

def mark_all_notifications_as_read(
    db: Session,
    user_id: int
):
    notifications = db.query(Notification).filter(
      Notification.user_id == user_id,
      Notification.is_read.is_(False)
    ).all()
    for notification in notifications:
      notification.is_read = True

    db.commit()

    return len(notifications)

def get_unread_notification_count(
    db: Session,
    user_id: int
):
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read.is_(False)
    ).count()