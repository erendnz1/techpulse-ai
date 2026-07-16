import feedparser
import requests

from datetime import datetime
from email.utils import parsedate_to_datetime


def fetch_rss(source: dict, limit: int = 20):
    """
    Reads an RSS/Atom feed and returns normalized news items.

    Returns:
    [
        {
            "title": ...,
            "content": ...,
            "url": ...,
            "image_url": ...,
            "author": ...,
            "source": ...,
            "category": ...,
            "region": ...,
            "published_at": ...
        }
    ]
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

    limit = source.get("limit", 20)

    for entry in feed.entries[:limit]:

        published_at = datetime.utcnow()

        if hasattr(entry, "published"):
            try:
                published_at = parsedate_to_datetime(entry.published)
            except Exception:
                pass

        summary = ""

        if hasattr(entry, "summary"):
            summary = entry.summary

        article = {
            "title": entry.title,
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

    return articles