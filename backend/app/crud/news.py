from sqlalchemy.orm import Session

from app.models.news import News
from app.schemas.news import NewsCreate


def create_news(db: Session, news: NewsCreate):
    db_news = News(
        title=news.title,
        content=news.content,
        source=news.source,
        url=news.url,
        image_url=news.image_url,
        author=news.author,
        published_at=news.published_at,
    )

    db.add(db_news)
    db.commit()
    db.refresh(db_news)

    return db_news

def get_news(db: Session):
    return db.query(News).all()

def get_news_by_id(db: Session, news_id: int):
    return db.query(News).filter(News.id == news_id).first()

def delete_news(db: Session, news_id: int):
    news = db.query(News).filter(News.id == news_id).first()

    if news is None:
        return None

    db.delete(news)
    db.commit()

    return news

from app.schemas.news import NewsUpdate

def update_news(db: Session, news_id: int, news: NewsUpdate):
    db_news = db.query(News).filter(News.id == news_id).first()

    if db_news is None:
        return None

    db_news.title = news.title
    db_news.content = news.content
    db_news.source = news.source
    db_news.url = news.url
    db_news.image_url = news.image_url
    db_news.author = news.author
    db_news.published_at = news.published_at

    db.commit()
    db.refresh(db_news)

    return db_news

def get_news_by_url(db: Session, url: str):
    return db.query(News).filter(News.url == url).first()

def save_news(db: Session, news_data: dict):
    news = News(**news_data)

    db.add(news)
    db.commit()
    db.refresh(news)

    return news