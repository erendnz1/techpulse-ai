from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.notification import (
    NotificationResponse,
    UnreadNotificationCountResponse,
)
from app.crud.notification import (
    get_user_notifications,
    mark_notification_as_read,
    mark_all_notifications_as_read,
    get_unread_notification_count,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)
@router.get("/me", response_model=list[NotificationResponse])
def get_my_notifications(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_notifications(
      db=db,
      user_id=current_user.id,
      skip=skip,
      limit=limit,
      unread_only=unread_only
    )
 
@router.patch("/read-all")
def read_all_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_count = mark_all_notifications_as_read(
        db=db,
        user_id=current_user.id
    )
 
    return {
        "message": "All notifications marked as read",
        "updated_count": updated_count
    }


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse
)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = mark_notification_as_read(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id
    )
    if notification is None:
        raise HTTPException(
          status_code=404,
          detail="Notification not found"
        )

    return notification

@router.get(
    "/unread-count",
    response_model=UnreadNotificationCountResponse
)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    unread_count = get_unread_notification_count(
        db=db,
        user_id=current_user.id
    )

    return {
        "unread_count": unread_count
    } 