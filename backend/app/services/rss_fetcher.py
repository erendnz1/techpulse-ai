import feedparser
import requests

from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime


def fetch_rss(source: dict, limit: int = 5):
    """
    Reads an RSS/Atom feed and returns normalized news items.
    """

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/138.0.0.0 Safari/537.36"
        ),
        "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
    }

    response = requests.get(
        source["url"],
        headers=headers,
        timeout=15,
    )

    response.raise_for_status()

    feed = feedparser.parse(response.content)

    articles = []

    # Kaynak bazlı limit (tanımlanmışsa onu kullan)
    limit = source.get("limit", limit)

    # Son 2 günün haberleri
    cutoff = datetime.now(timezone.utc) - timedelta(days=2)

    for entry in feed.entries[:limit]:

        published_at = datetime.now(timezone.utc)

        if hasattr(entry, "published"):
            try:
                published_at = parsedate_to_datetime(entry.published)
            except Exception:
                pass

        # Timezone yoksa UTC ekle
        if published_at.tzinfo is None:
            published_at = published_at.replace(tzinfo=timezone.utc)

        # Eski haberleri alma
        if published_at < cutoff:
            continue

        title = getattr(entry, "title", "").strip()

        summary = getattr(entry, "summary", "").strip()

        # Başlıksız haberleri alma
        if not title:
            continue

        # Çok kısa içerikleri AI'a göndermeye değmez
        if len(summary) < 100:
            continue

        article = {
            "title": title,
            "content": summary,
            "url": entry.link,
            "image_url": None,
            "author": getattr(entry, "author", None),
            "source": source["name"],
            "category": source["category"],
            "region": source["region"],
            "published_at": published_at,
        }

        articles.append(article)

    print(f"{source['name']}: {len(articles)} articles kept.")

    return articles