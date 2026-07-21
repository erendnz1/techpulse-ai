from sqlalchemy.orm import Session
from sqlalchemy import desc, func, nullslast
from app.models.news import News
from app.schemas.news import NewsCreate

from sqlalchemy import or_
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

from sqlalchemy import desc, nullslast
from sqlalchemy.orm import Session

from app.models.news import News
from sqlalchemy import desc, nullslast, or_

def get_news(
    db: Session,
    category: str | None = None,
    region: str | None = None,
    minimum_importance_score: int | None = None,
    risk_level: str | None = None,
    source: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    query = db.query(News)

    # Only AI analyzed news
    query = query.filter(News.summary.isnot(None))

    # Category
    if (
        category
        and category.lower() != "all"
        and category != "All Categories"
    ):
        query = query.filter(News.category == category)

    # Region
    if (
        region
        and region.lower() != "all"
        and region != "All Regions"
    ):
        query = query.filter(
    func.lower(News.region) == region.lower()
)

    # Importance
    if minimum_importance_score is not None:
        query = query.filter(
            News.importance_score >= minimum_importance_score
        )

    # Risk
    if (
        risk_level
        and risk_level.lower() != "all"
        and risk_level != "All Risk Levels"
    ):
        query = query.filter(
            News.risk_level.ilike(risk_level)
        )

    # Source
    if (
        source
        and source.lower() != "all"
        and source != "All Sources"
    ):
        query = query.filter(
            News.source.ilike(source)
        )

    # Search
    if search and search.strip():
        query = query.filter(
            or_(
                News.title.ilike(f"%{search}%"),
                News.summary.ilike(f"%{search}%"),
                News.source.ilike(f"%{search}%"),
                News.category.ilike(f"%{search}%"),
            )
        )

    return (
        query.order_by(
            desc(News.published_at),
            nullslast(desc(News.importance_score)),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

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

    # Normalize region
    if news_data.get("region"):
        news_data["region"] = news_data["region"].lower()

    news = News(**news_data)

    db.add(news)
    db.commit()
    db.refresh(news)

    print(f"Saved ID: {news.id}")
    print(f"Saved Summary: {news.summary}")

    return news

def get_personalized_news(
    db: Session,
    categories: list[str],
    regions: list[str],
    minimum_importance_score: int,
    skip: int = 0,
    limit: int = 20,
):
    print("\n========== PERSONALIZED NEWS DEBUG ==========")
    print("Categories:", categories)
    print("Regions:", regions)
    print("Minimum Importance:", minimum_importance_score)

    current_score = minimum_importance_score
    all_news = []

    while current_score >= min(minimum_importance_score, 6):
        query = (
    db.query(News)
    .filter(
        or_(
            News.region.in_(regions),
            News.region.is_(None),
        ),
        News.importance_score >= current_score,
    )
    .order_by(
    News.published_at.desc(),
    News.importance_score.desc(),
)
)

        if categories:
           query = query.filter(News.category.in_(categories))

        all_news = query.all()

        if all_news:
           print(f"Found {len(all_news)} articles with importance >= {current_score}")
           break

        current_score -= 1

    print("After region + importance filter:", query.count())
    debug_news = query.all()

    print("\nArticles after region + importance:")
    for news in debug_news:
       print(
        f"Title: {news.title}\n"
        f"Category: {news.category}\n"
        f"Region: {news.region}\n"
        f"Importance: {news.importance_score}\n"
    )
    # Kullanıcının kategori tercihi varsa uygula
    if categories:
        query = query.filter(News.category.in_(categories))

    print("After category filter:", query.count())

    all_news = query.all()

    print("Total query results:", len(all_news))

    if all_news:
        print("\nFirst matching articles:")
        for news in all_news[:5]:
            print(
                f"- {news.title} | "
                f"Category={news.category} | "
                f"Region={news.region} | "
                f"Importance={news.importance_score}"
            )
    else:
        print("No articles matched the filters.")

    print("=============================================\n")

    return all_news[skip : skip + limit]
from sqlalchemy import or_


def get_security_news(
    db: Session,
    region: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    query = db.query(News).filter(News.category == "Security")

    if region:
        query = query.filter(func.lower(News.region) == region.lower())

    return (
        query.order_by(
            News.published_at.desc(),
            News.importance_score.desc(),
            
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
    return get_personalized_news(
        db=db,
        categories=categories,
        regions=regions,
        minimum_importance_score=minimum_importance_score,
        skip=0,
        limit=limit,
    )

from sqlalchemy import or_, func
from app.models.news import News
def search_news(
    db,
    query: str,
    limit: int = 5,
):
    search = f"%{query}%"

    return (
        db.query(News)
        .filter(
            or_(
                News.title.ilike(search),
                News.summary.ilike(search),
                News.source.ilike(search),
                News.category.ilike(search),
            )
        )
        .order_by(News.published_at.desc())
        .limit(limit)
        .all()
    )