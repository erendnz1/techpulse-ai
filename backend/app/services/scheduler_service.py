from apscheduler.schedulers.background import BackgroundScheduler

from app.database.session import SessionLocal
from app.services.news_service import (
    process_and_save_news,
    reanalyze_pending_news,
)
from app.services.cleanup_service import cleanup_old_news


scheduler = BackgroundScheduler()


def scheduled_news_fetch():
    print("🚀 Scheduled news fetch started...")

    db = SessionLocal()

    try:
        saved_news = process_and_save_news(db)

        print(
            f"✅ Scheduled news fetch completed. "
            f"Saved {len(saved_news)} new articles."
        )

    except Exception as error:
        print(f"❌ Scheduled news fetch failed: {error}")

    finally:
        db.close()


def scheduled_pending_analysis():
    print("🤖 Starting pending AI analysis...")

    db = SessionLocal()

    try:
        reanalyze_pending_news(db)

        print("✅ Pending AI analysis completed.")

    except Exception as error:
        print(f"❌ Pending AI analysis failed: {error}")

    finally:
        db.close()


def scheduled_cleanup():
    print("🧹 Starting old news cleanup...")

    db = SessionLocal()

    try:
        result = cleanup_old_news(db)

        print(
            f"✅ Cleanup completed. "
            f"Deleted {result['deleted_news']} news and "
            f"{result['deleted_notifications']} notifications."
        )

    except Exception as error:
        print(f"❌ Cleanup failed: {error}")

    finally:
        db.close()


# News fetch every 2 hours
scheduler.add_job(
    scheduled_news_fetch,
    trigger="interval",
    hours=2,
    id="news_fetch_job",
    replace_existing=True,
)


# AI analysis every 4 hours
scheduler.add_job(
    scheduled_pending_analysis,
    trigger="interval",
    hours=4,
    id="pending_analysis_job",
    replace_existing=True,
)


# Cleanup every day at 03:00
scheduler.add_job(
    scheduled_cleanup,
    trigger="cron",
    hour=3,
    minute=0,
    id="cleanup_job",
    replace_existing=True,
)