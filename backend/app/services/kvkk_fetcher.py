import requests
from datetime import datetime, UTC
from bs4 import BeautifulSoup
def fetch_kvkk_data_breaches():
    url = "https://www.kvkk.gov.tr/"
    response = requests.get(
       url,
       timeout=20,
    )

    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    links = soup.find_all("a", href=True)

    data_breach_links = [
      link
      for link in links
      if "kamuoyu-duyurusu-veri-ihlali-bildirimi"
      in link.get("href", "").lower()
    ]

    breaches = []

    for link in data_breach_links:
      breaches.append({
        "title": link.get_text(" ", strip=True),
        "url": link.get("href"),
    })
    return breaches

def fetch_kvkk_breach_content(url):
    response = requests.get(
        url,
        timeout=20,
    )

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    content = soup.find(
        "div",
        class_="news__detail-article"
    )

    if content is None:
        return ""

    return content.get_text(" ", strip=True)

def transform_kvkk_breach(breach):
    content = fetch_kvkk_breach_content(breach["url"])

    return {
        "title": breach["title"],
        "content": content,
        "source": "KVKK",
        "url": breach["url"],
        "image_url": None,
        "author": "Kişisel Verileri Koruma Kurumu",
        "region": "turkey",
        "published_at": datetime.now(UTC),
        "category": "Security",
        "region": "turkey",
    }