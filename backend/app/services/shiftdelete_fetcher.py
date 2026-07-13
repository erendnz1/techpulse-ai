import requests
import xml.etree.ElementTree as ET
import re

def fetch_shiftdelete_news():
    url = "https://shiftdelete.net/feed"

    response = requests.get(url, timeout=20)
    response.raise_for_status()

    return response.text

def parse_shiftdelete_news(xml_content):
    root = ET.fromstring(xml_content)

    articles = []

    for item in root.findall(".//item")[:3]:
        title = item.findtext("title")
        description = item.findtext("description")
        link = item.findtext("link")
        published_at = item.findtext("pubDate")

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

        article = {
            "title": title,
            "content": clean_content,
            "source": "ShiftDelete.Net",
            "region": "turkey",
            "url": link,
            "image_url": image_url,
            "author": "ShiftDelete.Net",
            "published_at": published_at,
        }

        articles.append(article)

    return articles