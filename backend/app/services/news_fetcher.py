import requests

from app.core.config import NEWS_API_KEY

BASE_URL = "https://newsapi.org/v2/top-headlines"


def fetch_technology_news():

    params = {
        "category": "technology",
        "country": "us",
        "pageSize": 10,
        "apiKey": NEWS_API_KEY,
    }

    response = requests.get(BASE_URL, params=params)

    return response.json()