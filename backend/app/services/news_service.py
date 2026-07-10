from sqlalchemy.orm import Session
from app.services.news_fetcher import fetch_technology_news
from app.services.ai_service import analyze_news
from app.crud.news import get_news_by_url, save_news
from app.services.devto_fetcher import (
    fetch_devto_articles,
    transform_devto_article,
)
def process_and_save_news(db: Session):
    articles = []

    try:
        newsapi_articles = fetch_technology_news()
        articles.extend(newsapi_articles)
        print(f"NewsAPI: {len(newsapi_articles)} articles fetched.")

    except Exception as error:
        print(f"NewsAPI fetch failed: {error}")

    try:
        devto_articles = fetch_devto_articles()

        transformed_devto_articles = [
            transform_devto_article(article)
            for article in devto_articles
        ]

        articles.extend(transformed_devto_articles)

        print(
            f"Dev.to: {len(transformed_devto_articles)} "
            f"articles fetched."
        )

    except Exception as error:
        print(f"Dev.to fetch failed: {error}")

    saved_news = []
    for article in articles:
        existing_news = get_news_by_url(db, article["url"])

        if existing_news:
            print("Duplicate news, skipped.")
            continue

        content = article["content"] or ""

        analysis = analyze_news(content)

        if analysis:
            article["summary"] = analysis.get("summary")
            article["category"] = analysis.get("category")
            article["importance_score"] = analysis.get("importance_score")
            article["risk_level"] = analysis.get("risk_level")
            article["affected_technologies"] = analysis.get("affected_technologies")
            article["recommended_action"] = analysis.get("recommended_action")
        else:
            article["summary"] = None
            article["category"] = None
            article["importance_score"] = None
            article["risk_level"] = None
            article["affected_technologies"] = []
            article["recommended_action"] = None

        news = save_news(db, article)

        saved_news.append(news)

    return saved_news