from sqlalchemy.orm import Session
from sqlalchemy import desc
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

def get_news(
    db: Session,
    category: str | None = None,
    region: str | None = None,
    minimum_importance_score: int | None = None,
    risk_level: str | None = None,
    source: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    query = db.query(News)

    if category:
        query = query.filter(News.category == category)

    if region:
        query = query.filter(News.region == region)

    if minimum_importance_score is not None:
        query = query.filter(
            News.importance_score >= minimum_importance_score
        )

    if risk_level:
        query = query.filter(
            News.risk_level.ilike(risk_level)
        )

    if source:
        query = query.filter(
            News.source.ilike(source)
        )
 
    return query.order_by(
        desc(News.importance_score),
        desc(News.published_at)
    ).offset(skip).limit(limit).all()


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
    db_news.summary = news.summary
    db_news.category = news.category


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

def get_personalized_news(
    db: Session,
    categories: list[str],
    regions: list[str],
    minimum_importance_score: int,
    skip: int = 0,
    limit: int = 20,
):
    query = (
        db.query(News)
        .filter(
            News.region.in_(regions),
            News.importance_score >= minimum_importance_score,
        )
        .order_by(
            News.published_at.desc(),
            News.importance_score.desc(),
        )
    )

    # Kullanıcının kategori tercihi varsa uygula
    if categories:
        query = query.filter(News.category.in_(categories))

    all_news = query.all()

    selected = []
    used_categories = set()

    # Her kategoriden önce 1 haber al
    for news in all_news:
        if news.category not in used_categories:
            selected.append(news)
            used_categories.add(news.category)

        if len(selected) >= limit:
            break

    # Limit dolmadıysa en güncel haberlerle tamamla
    if len(selected) < limit:
        selected_ids = {item.id for item in selected}

        for news in all_news:
            if news.id not in selected_ids:
                selected.append(news)

            if len(selected) >= limit:
                break

    return selected[skip:skip + limit]
from sqlalchemy import or_


def get_security_news(
    db: Session,
    region: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    query = db.query(News).filter(
        or_(
            News.title.ilike("CVE-%"),
            News.source == "KVKK",
        )
    )

    if region:
        query = query.filter(
            News.region == region
        )

    return (
        query.order_by(
            News.importance_score.desc(),
            News.published_at.desc(),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_dashboard_news(
    db: Session,
    categories: list[str],
    regions: list[str],
    minimum_importance_score: int,
    limit: int = 5,
):
    query = (
        db.query(News)
        .filter(
            News.region.in_(regions),
            News.importance_score >= minimum_importance_score,

            # Dashboard'da KVKK haberlerini gösterme
            News.source != "KVKK",

            # Kategorisiz ve Other haberleri gösterme
            News.category.isnot(None),
            News.category != "Other",

            # AI analiz edilmemiş haberleri gösterme
            News.summary.isnot(None),
        )
        .order_by(
            News.importance_score.desc(),
            News.published_at.desc(),
        )
    )

    if categories:
        query = query.filter(
            News.category.in_(categories)
        )

    news_list = query.all()

    selected = []
    used_categories = set()

    # Önce her kategoriden bir haber al
    for news in news_list:
        if news.category not in used_categories:
            selected.append(news)
            used_categories.add(news.category)

        if len(selected) >= limit:
            return selected

    # Limit dolmadıysa kalan en önemli haberlerle tamamla
    selected_ids = {item.id for item in selected}

    for news in news_list:
        if news.id not in selected_ids:
            selected.append(news)

        if len(selected) >= limit:
            break

    return selected