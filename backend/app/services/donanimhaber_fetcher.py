import requests
import xml.etree.ElementTree as ET
import re
from app.services.category_detector import detect_category
def fetch_donanimhaber_news():
    url = "https://www.donanimhaber.com/rss/tum/"

    response = requests.get(url, timeout=20)
    response.raise_for_status()

    return response.text

def parse_donanimhaber_news(xml_content):
    root = ET.fromstring(xml_content)

    articles = []

    for item in root.findall(".//item")[:3]:
        title = item.findtext("title")
        description = item.findtext("description")
        image_match = re.search(
          r'<img[^>]+src="([^"]+)"',
          description or ""
        )

        image_url = image_match.group(1) if image_match else None

        clean_content = re.sub(
          r"<[^>]+>",
          "",
          description or ""
        ).strip()

        link = item.findtext("link")
        published_at = item.findtext("pubDate")

        article = {
            "title": title,
            "content": clean_content,
            "source": "DonanımHaber",
            "region": "turkey",
            "url": link,
            "image_url": image_url,
            "author": "DonanımHaber",
            "published_at": published_at,
            "category": detect_category(
    title,
    clean_content,
),

        }

        articles.append(article)

    return articles