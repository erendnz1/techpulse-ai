import requests

from app.core.config import NEWS_API_KEY

BASE_URL = "https://newsapi.org/v2/top-headlines"


def fetch_technology_news():

    params = {
        "category": "technology",
        "country": "us",
        "pageSize":2,
        "apiKey": NEWS_API_KEY,
    }

    response = requests.get(BASE_URL, params=params)

    data = response.json()
    print(data)
    articles = data.get("articles", [])

    transformed_articles = [
    transform_news(article)
    for article in articles
    ]

    return transformed_articles


def transform_news(article):
    return {
        "title": article.get("title"),
        "content": article.get("content") or article.get("description"),
        "source": article.get("source", {}).get("name"),
        "url": article.get("url"),
        "image_url": article.get("urlToImage"),
        "published_at": article.get("publishedAt"),
    }