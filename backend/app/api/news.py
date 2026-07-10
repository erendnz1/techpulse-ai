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
from app.services.ai_service import analyze_news
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

    for index, article in enumerate(articles, start=1):
        

        existing_news = get_news_by_url(db, article["url"])

        if existing_news:
            print("Duplicate news, skipped.")
            continue

        content = article["content"] or ""

        
        analysis = analyze_news(content)

        if analysis:
           article["summary"] = analysis.get("summary")
           article["category"] = analysis.get("category")
           article["importance_score"] = analysis.get("importance_score")
           article["risk_level"] = analysis.get("risk_level")
        else:
           article["summary"] = None
           article["category"] = None
           article["importance_score"] = None
           article["risk_level"] = None

        
        
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

    analysis = analyze_news(sample_text)

    return {
        "original": sample_text,
        "analysis": analysis
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
