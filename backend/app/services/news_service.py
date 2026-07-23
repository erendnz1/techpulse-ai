from app.models.news import News
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.services.news_fetcher import fetch_technology_news
from app.services.ai_service import analyze_news
from app.crud.news import get_news_by_url, save_news
from app.services.devto_fetcher import (
    fetch_devto_articles,
    transform_devto_article,
)
from app.services.github_fetcher import (
    fetch_github_releases,
    transform_github_release,
)
from app.services.cve_fetcher import (
    fetch_recent_cves,
    transform_cve,
)
from app.services.kvkk_fetcher import (
    fetch_kvkk_data_breaches,
    transform_kvkk_breach,
)
from app.services.donanimhaber_fetcher import (
    fetch_donanimhaber_news,
    parse_donanimhaber_news,
)
from app.services.shiftdelete_fetcher import (
    fetch_shiftdelete_news,
    parse_shiftdelete_news,
)
from app.services.notification_service import create_notifications_for_news
from app.services.rss_fetcher import fetch_rss
from app.services.rss_sources import RSS_SOURCES
from app.core.exceptions import QuotaExceededError
from app.services.ai_service import analyze_news, detect_category

def process_and_save_news(db: Session):
    articles = []
    stats = {
    "sources": 0,
    "fetched": 0,
    "saved": 0,
    "duplicates": 0,
    "irrelevant": 0,
    "notifications": 0,
    "emails": 0,
    "ai_status": "Available",
}
    try:
        newsapi_articles = fetch_technology_news()
        articles.extend(newsapi_articles)
        stats["sources"] += 1
        stats["fetched"] += len(newsapi_articles)
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

        stats["sources"] += 1
        stats["fetched"] += len(transformed_devto_articles)

        print(
            f"Dev.to: {len(transformed_devto_articles)} "
            f"articles fetched."
        )

    except Exception as error:
        print(f"Dev.to fetch failed: {error}")

    try:
        github_releases = fetch_github_releases()

        transformed_github_releases = [
          transform_github_release(release)
          for release in github_releases
        ]

        articles.extend(transformed_github_releases)
        stats["sources"] += 1
        stats["fetched"] += len(transformed_github_releases)
        print(
          f"GitHub Releases: {len(transformed_github_releases)} "
          f"releases fetched."
    )

    except Exception as error:
        print(f"GitHub Releases fetch failed: {error}")
    print("✅ GitHub section finished")
    print("➡️ Starting CVE fetch")
    try:
        cve_vulnerabilities = fetch_recent_cves()

        transformed_cves = [
          transform_cve(vulnerability)
          for vulnerability in cve_vulnerabilities
        ]

        articles.extend(transformed_cves)

        stats["sources"] += 1
        stats["fetched"] += len(transformed_cves)
        
        print(
             f"NVD/CVE: {len(transformed_cves)} "
             f"vulnerabilities fetched."
        )

    except Exception as error:
        print(f"NVD/CVE fetch failed: {error}")
    print("✅ CVE section finished")
    
    try:
       kvkk_breaches = fetch_kvkk_data_breaches()

       transformed_kvkk_breaches = [
        transform_kvkk_breach(breach)
        for breach in kvkk_breaches
       ]

       articles.extend(transformed_kvkk_breaches)
       stats["sources"] += 1
       stats["fetched"] += len(transformed_kvkk_breaches)
       print(
          f"KVKK: {len(transformed_kvkk_breaches)} "
          f"data breach notifications fetched."
        )

    except Exception as error:
        print(f"KVKK fetch failed: {error}")

    try:
      donanimhaber_xml = fetch_donanimhaber_news()

      donanimhaber_articles = parse_donanimhaber_news(
        donanimhaber_xml
      )

      articles.extend(donanimhaber_articles)
      stats["sources"] += 1
      stats["fetched"] += len(donanimhaber_articles)
      print(
        f"DonanımHaber: {len(donanimhaber_articles)} "
        f"articles fetched."
      )

    except Exception as error:
        print(f"DonanımHaber fetch failed: {error}")
    
    try:
       shiftdelete_xml = fetch_shiftdelete_news()

       shiftdelete_articles = parse_shiftdelete_news(
        shiftdelete_xml
       )

       articles.extend(shiftdelete_articles)
       stats["sources"] += 1
       stats["fetched"] += len(shiftdelete_articles)
       print(
          f"ShiftDelete.Net: {len(shiftdelete_articles)} "
          f"articles fetched."
        )

    except Exception as error:
       print(f"ShiftDelete.Net fetch failed: {error}")
    try:
        rss_articles = []

        for source in RSS_SOURCES:
          try:
           rss_articles.extend(fetch_rss(source, limit=3))

          except Exception as error:
           print(f"{source['name']} RSS failed: {error}")
 
        articles.extend(rss_articles)
        stats["sources"] += len(RSS_SOURCES)
        stats["fetched"] += len(rss_articles)
        print(
         f"RSS Sources: {len(rss_articles)} "
         f"articles fetched."
        )

    except Exception as error:
      print(f"RSS fetch failed: {error}")
    saved_news = []
    ai_enabled = True

    for article in articles:
        existing_news = get_news_by_url(db, article["url"])

        if existing_news:
            stats["duplicates"] += 1
            continue

        title = article.get("title", "")
        content = article.get("content", "")

        # Başlıksız haberleri alma
        if not title:
          continue

    # Çok kısa içerikleri AI'a gönderme
        if len(content) < 120:
          print(f"Skipped (content too short): {title}")
          continue

    # Aynı başlığa sahip haber varsa tekrar işleme
        duplicate_title = (
          db.query(News)
          .filter(News.title == title)
          .first()
    )

        if duplicate_title:
          stats["duplicates"] += 1
          continue

        combined_text = f"""
Title:
{title}

Content:
{content}
"""

        content_for_analysis = combined_text[:3000]

        analysis = None

        if ai_enabled:
            try:
                analysis = analyze_news(content_for_analysis)
                print("=" * 60)
                print(article["title"])
                print(analysis)
                print("=" * 60)
            except QuotaExceededError:
                ai_enabled = False
                stats["ai_status"] = "Quota Exhausted"

                print(
                    "\n"
                    "========================================\n"
                    "Groq daily quota exhausted.\n"
                    "AI analysis disabled for remaining articles.\n"
                    "========================================\n"
                )

        if analysis:
            if analysis.get("is_relevant") is False:
                stats["irrelevant"] += 1
                print(f"Irrelevant news skipped: {article['title']}")
                continue

            article["summary"] = analysis.get("summary")

            rule_category = detect_category(combined_text)

            article["category"] = (
                rule_category
                if rule_category
                else analysis.get("category")
            )

            article["importance_score"] = analysis.get("importance_score")
            article["risk_level"] = analysis.get("risk_level")
            article["affected_technologies"] = analysis.get(
                "affected_technologies"
            )
            article["recommended_action"] = analysis.get(
                "recommended_action"
            )

            if article.get("source") == "KVKK":
                article["category"] = "Security"
                article["region"] = "turkey"

        else:
            article["summary"] = article.get("summary")

            article["category"] = (
                article.get("category")
                or detect_category(combined_text)
                or "Other"
            )

            article["importance_score"] = article.get("importance_score")
            article["risk_level"] = article.get("risk_level")
            article["affected_technologies"] = article.get(
                "affected_technologies", []
            )
            article["recommended_action"] = article.get(
                "recommended_action"
            )

        news = save_news(db, article)

        create_notifications_for_news(
            db=db,
            news=news,
        )

        saved_news.append(news)
        stats["saved"] += 1

    print("\n========================================")
    print("        TechPulse AI Scheduler")
    print("========================================")
    print(f"Sources Scanned : {stats['sources']}")
    print(f"Articles Fetched: {stats['fetched']}")
    print(f"Saved           : {stats['saved']}")
    print(f"Duplicates      : {stats['duplicates']}")
    print(f"Irrelevant      : {stats['irrelevant']}")
    print(f"AI Status       : {stats['ai_status']}")
    print("========================================\n")

    return saved_news

def reanalyze_pending_news(db: Session):
    pending_news = (
    db.query(News)
    .filter(
        News.summary.is_(None),
        News.content.isnot(None),
    )
    .order_by(News.published_at.desc())
    .limit(20)
    .all()
)

    if not pending_news:
        print("No pending news to analyze.")
        return

    print(f"Reanalyzing {len(pending_news)} pending articles...")

    for news in pending_news:
        combined_text = f"""
Title:
{news.title}

Content:
{news.content or ""}
"""

        analysis = analyze_news(combined_text[:3000])

        if not analysis:
          continue

        rule_category = detect_category(combined_text)

        news.summary = analysis.get("summary")

        news.category = (
           rule_category
           if rule_category
           else analysis.get("category")
        )

        news.importance_score = analysis.get("importance_score")
        news.risk_level = analysis.get("risk_level")
        news.affected_technologies = analysis.get(
          "affected_technologies"
        )
        news.recommended_action = analysis.get(
         "recommended_action"
        )

        db.commit()

        create_notifications_for_news(
         db=db,
          news=news,
     )

    print(f"✓ Updated: {news.title}")