from apscheduler.schedulers.background import BackgroundScheduler

from app.database.session import SessionLocal
from app.services.news_service import process_and_save_news


def scheduled_news_fetch():
    db = SessionLocal()

    try:
        saved_news = process_and_save_news(db)

        print(
            f"Scheduled news fetch completed. "
            f"Saved {len(saved_news)} new articles."
        )

    except Exception as error:
        print(f"Scheduled news fetch failed: {error}")

    finally:
        db.close()

scheduler = BackgroundScheduler()

scheduler.add_job(
    scheduled_news_fetch,
    trigger="interval",
    hours=2,
    id="news_fetch_job",
    replace_existing=True,
)