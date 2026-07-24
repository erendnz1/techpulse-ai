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
        body=f"""
<html>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">

<div style="max-width:650px;margin:40px auto;background:#fff;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">

<h1 style="margin:0;color:#2563eb;">🚀 TechPulse AI</h1>

<p style="color:#6b7280;margin-top:6px;">
Technology Intelligence Platform
</p>

<hr style="margin:30px 0;">

<h2 style="margin:0;">🚨 High Importance Technology Alert</h2>

<h3 style="margin-top:20px;">
OpenAI Releases GPT-6 Preview
</h3>

<div style="background:#f9fafb;padding:20px;border-radius:10px;margin-top:20px;">
<b>AI Summary</b>

<p style="margin-top:10px;">
OpenAI introduced GPT-6 Preview with major improvements in reasoning,
coding and AI agents.
</p>
</div>

<table style="width:100%;margin-top:25px;">
<tr>
<td><b>Category</b></td>
<td>AI</td>
</tr>

<tr>
<td><b>Importance</b></td>
<td>9 / 10</td>
</tr>

<tr>
<td><b>Risk</b></td>
<td>High</td>
</tr>
</table>

<h3 style="margin-top:30px;">🔧 Affected Technologies</h3>

<ul>
<li>OpenAI API</li>
<li>GPT Models</li>
<li>AI Agents</li>
</ul>

<h3>✅ Recommended Action</h3>

<p>
Review the release notes and evaluate migration to the latest model.
</p>

<div style="text-align:center;margin:40px 0;">
<a
href="https://techpulse-ai.vercel.app/dashboard/news/999"
style="
background:#2563eb;
color:white;
padding:16px 30px;
border-radius:10px;
text-decoration:none;
font-weight:bold;
display:inline-block;
">
🚀 Open in TechPulse AI
</a>
</div>

<hr>

<p style="font-size:13px;color:#6b7280;">
View the complete AI analysis, affected technologies,
recommendations and the original source inside TechPulse AI.
</p>

</div>

</body>
</html>
"""
    )

    return {
        "message": "Test email sent successfully."
    }