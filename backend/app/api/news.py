from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.session import get_db
from app.crud.news import (
    create_news,
    get_news,
    get_news_by_id,
    update_news,
    delete_news,
    save_news,
    get_news_by_url
)
from app.schemas.news import (
    NewsCreate,
    NewsResponse,
    NewsUpdate,
)
from app.services.news_fetcher import fetch_technology_news
router = APIRouter(
    prefix="/news",
    tags=["News"]
)
from app.services.ai_service import generate_summary
from app.services.ai_service import generate_summary

@router.post("/", response_model=NewsResponse)
def create_news_endpoint(
    news: NewsCreate,
    db: Session = Depends(get_db)
):
    return create_news(db, news)

@router.get("/", response_model=list[NewsResponse])
def get_all_news(db: Session = Depends(get_db)):
    return get_news(db)

@router.get("/fetch")
def fetch_news(db: Session = Depends(get_db)):
    articles = fetch_technology_news()

    saved_news = []

    for article in articles:
        existing_news = get_news_by_url(db, article["url"])

        if existing_news:
            continue

        summary = generate_summary(article["content"])
        article["summary"] = summary

        news = save_news(db, article)
        saved_news.append(news)

    return {
    "message": "News fetched successfully.",
    "saved_count": len(saved_news)
    }



@router.get("/test-ai")
def test_ai():
    sample_text = """
    OpenAI announced a new GPT model with improved reasoning,
    faster responses and lower latency for developers.
    """

    summary = generate_summary(sample_text)

    return {
        "original": sample_text,
        "summary": summary
    }


@router.get("/{news_id}", response_model=NewsResponse)
def get_news_detail(
    news_id: int,
    db: Session = Depends(get_db)
):
    news = get_news_by_id(db, news_id)

    if news is None:
        raise HTTPException(
            status_code=404,
            detail="News not found"
        )

    return news

@router.delete("/{news_id}")
def delete_news_endpoint(
    news_id: int,
    db: Session = Depends(get_db)
):
    news = delete_news(db, news_id)

    if news is None:
        raise HTTPException(
            status_code=404,
            detail="News not found"
        )

    return {"message": "News deleted successfully"}



@router.put("/{news_id}", response_model=NewsResponse)
def update_news_endpoint(
    news_id: int,
    news: NewsUpdate,
    db: Session = Depends(get_db)
):
    updated_news = update_news(db, news_id, news)

    if updated_news is None:
        raise HTTPException(
            status_code=404,
            detail="News not found"
        )

    return updated_news
