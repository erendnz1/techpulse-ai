from sqlalchemy.orm import Session

from app.models.news import News
from app.models.user import User
from app.models.user_preferences import UserPreferences

from app.services.email_service import (
    send_news_notification_email,
)

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


        # Notification rule

        minimum_score = preference.minimum_importance_score or 0

        if news.category == "Security":
          print(
              "DEBUG:",
               news.category,
               news.risk_level,
               news.importance_score,
          )
          risk_level = (news.risk_level or "").strip()
          is_important = (
               risk_level in ["High", "Critical"]
               or (
                 news.importance_score is not None
                 and news.importance_score >= minimum_score
                )
            )
          
        else:

          if news.importance_score is not None:

                is_important = (
                 news.importance_score >= minimum_score
               )

          else:

              is_important = False
          

        if not is_important:
            print(
    f"❌ Email/Notification skipped -> "
    f"Title={news.title} | "
    f"Category={news.category} | "
    f"Importance={news.importance_score} | "
    f"Minimum={minimum_score} | "
    f"Risk={news.risk_level}"
)
            print(
            "❌ Notification rule failed:",
             news.importance_score,
             news.risk_level,
            )

            continue


        # Duplicate check
        exists = notification_exists(
          db=db,
          user_id=preference.user_id,
          news_id=news.id,
        )

        print(
         f"DEBUG duplicate -> user:{preference.user_id}, news:{news.id}, exists:{exists}"
        )

        if exists:
          print(
           "⚠️ Notification already exists:",
           preference.user_id,
        )
          continue

        print("✅ Passed duplicate check")

        
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

        
        if news.importance_score is not None:

          should_send_email = is_important

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

            try:

                print(
                    f"📧 Sending email to {user.email}"
                )
                print("========== ABOUT TO SEND EMAIL ==========")
                send_news_notification_email(
    to_email=user.email,
    news=news,
)
                

                print(
                    f"✅ Email sent to {user.email}"
                )


            except Exception as e:

                print(
                    f"❌ Email failed for {user.email}: {e}"
                )