from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.services.email_service import send_email
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

@router.post("/test-email")
def send_test_email(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    send_email(
        to_email=current_user.email,
        subject="🚀 TechPulse AI | Test Email",
        body="""
<html>
<body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:30px;">

<div style="max-width:650px;margin:auto;background:white;border-radius:12px;padding:30px;border:1px solid #e5e7eb;">

<h1 style="color:#2563eb;margin-bottom:0;">
🚀 TechPulse AI
</h1>

<p style="color:#6b7280;margin-top:5px;">
Technology Intelligence Platform
</p>

<hr style="margin:25px 0;">

<h2>✅ Email System Working</h2>

<p>
Congratulations!
</p>

<p>
Your email notification system has been configured successfully.
</p>

<div style="
background:#eff6ff;
border-left:4px solid #2563eb;
padding:15px;
margin:25px 0;
">

<strong>Status</strong><br>
SMTP Connection: ✅ Successful<br>
Authentication: ✅ Successful<br>
Email Delivery: ✅ Successful

</div>

<p>
You are now ready to receive AI-powered technology alerts from
<strong>TechPulse AI</strong>.
</p>

<p style="margin-top:30px;">
<a href="http://localhost:3000/dashboard"
style="
background:#2563eb;
color:white;
padding:12px 18px;
text-decoration:none;
border-radius:8px;
display:inline-block;
">
Open Dashboard
</a>
</p>

<hr style="margin-top:30px;">

<p style="font-size:13px;color:#9ca3af;">
This is an automated email from TechPulse AI.
</p>

</div>

</body>
</html>
"""
    )

    return {
        "message": "Test email sent successfully."
    }