import requests


def fetch_devto_articles():
    url = "https://dev.to/api/articles"

    params = {
        "per_page": 3,
        "top": 1,
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    articles = response.json()

    return articles


def transform_devto_article(article):
    return {
        "title": article.get("title"),
        "content": article.get("description") or "",
        "source": "Dev.to",
        "url": article.get("url"),
        "image_url": article.get("cover_image"),
        "author": article.get("user", {}).get("name"),
        "published_at": article.get("published_at"),
    } 