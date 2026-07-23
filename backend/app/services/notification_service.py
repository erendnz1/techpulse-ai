from sqlalchemy.orm import Session

from app.models.news import News
from app.models.user import User
from app.models.user_preferences import UserPreferences

from app.services.email_service import send_email

from app.crud.notification import (
    create_notification,
    notification_exists,
)


def create_notifications_for_news(
    db: Session,
    news: News,
): 
    print("========== NOTIFICATION SERVICE STARTED ==========")
    preferences = (
        db.query(UserPreferences)
        .filter(
            UserPreferences.notification_enabled.is_(True)
        )
        .all()
    )

    print(
        "🔎 Checking notification:",
        news.title,
        "| Category:",
        news.category,
        "| Region:",
        news.region,
        "| Score:",
        news.importance_score,
    )

    for preference in preferences:

        print(
            "👤 User preference:",
            preference.user_id,
            preference.categories,
            preference.regions,
            preference.minimum_importance_score,
            "Email:",
            preference.email_notification_enabled,
        )

        # Category check
        if (
            preference.categories
            and news.category not in preference.categories
        ):
            print(
                "❌ Category mismatch:",
                preference.user_id,
            )
            continue


        # Region check
        news_region = (news.region or "").lower()

        user_regions = [
            region.lower()
            for region in (preference.regions or [])
        ]

        if (
            user_regions
            and news_region not in user_regions
        ):
            print(
                "❌ Region mismatch:",
                preference.user_id,
                news_region,
            )
            continue


        # Importance check
        minimum_score = (
            preference.minimum_importance_score
            or 0
        )

        if news.importance_score is not None:

            is_important = (
                news.importance_score >= minimum_score
            )

        else:

            is_important = news.category in {
                "AI",
                "Security",
                "Framework",
                "Developer Tools",
                "Cloud",
                "DevOps",
            }


        if not is_important:
            print(
                "❌ Importance failed:",
                news.importance_score,
            )
            continue


        # Duplicate check
        if notification_exists(
            db=db,
            user_id=preference.user_id,
            news_id=news.id,
        ):
            print(
                "⚠️ Notification already exists:",
                preference.user_id,
            )
            continue


        message = (
            f"New {news.category} news detected: "
            f"{news.title}"
        )


        create_notification(
            db=db,
            user_id=preference.user_id,
            news_id=news.id,
            message=message,
        )


        should_send_email = False


        if news.importance_score is not None:

            should_send_email = (
                news.importance_score >= 8
                or news.risk_level in [
                    "High",
                    "Critical",
                ]
            )

        else:

            should_send_email = news.category in {
                "AI",
                "Security",
                "Framework",
                "Developer Tools",
            }


        print(
            "📧 Email check:",
            preference.user_id,
            "Enabled:",
            preference.email_notification_enabled,
            "Should send:",
            should_send_email,
        )
        if (
            preference.email_notification_enabled
            and should_send_email
        ):

            user = (
                db.query(User)
                .filter(
                    User.id == preference.user_id
                )
                .first()
            )


            print(
                "📨 Email user:",
                user.email if user else None
            )


            if not user:
                continue


            emoji = {
                "Security": "🚨",
                "AI": "🤖",
                "Cloud": "☁️",
                "DevOps": "⚙️",
                "Developer Tools": "🛠️",
                "Framework": "📦",
                "Software": "💻",
                "Mobile": "📱",
                "Business": "📈",
                "Gaming": "🎮",
            }.get(
                news.category,
                "📰"
            )


            subject = (
                f"{emoji} TechPulse AI | "
                f"{news.category} - "
                f"{news.title[:60]}"
            )


            try:

                print(
                    f"📧 Sending email to {user.email}"
                )
                print("========== ABOUT TO SEND EMAIL ==========")
                print("EMAIL FUNCTION IS BEING CALLED")
                send_email(
                    to_email=user.email,
                    subject=subject,
                    body=f"""
<html>
<body>

<h1>🚀 TechPulse AI</h1>

<h2>New {news.category} Alert</h2>

<p>
<b>Title:</b><br>
{news.title}
</p>

<p>
<b>Importance:</b><br>
{news.importance_score}/10
</p>

<p>
<b>Risk Level:</b><br>
{news.risk_level}
</p>

<p>
<b>Summary:</b><br>
{news.summary or "No summary available."}
</p>

<p>
<b>Affected Technologies:</b><br>
{", ".join(news.affected_technologies) if news.affected_technologies else "Not specified"}
</p>

<p>
<b>Recommended Action:</b><br>
{news.recommended_action or "No recommendation available."}
</p>

<a href="{news.url}">
Read Full Article
</a>

</body>
</html>
""",
                )

                print(
                    f"✅ Email sent to {user.email}"
                )


            except Exception as e:

                print(
                    f"❌ Email failed for {user.email}: {e}"
                )