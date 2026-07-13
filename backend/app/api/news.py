from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.crud.news import (
    create_news,
    get_news,
    get_news_by_id,
    update_news,
    delete_news,
)
from app.schemas.news import (
    NewsCreate,
    NewsResponse,
    NewsUpdate,
)
from app.services.ai_service import analyze_news
from app.services.news_service import process_and_save_news


router = APIRouter(
    prefix="/news",
    tags=["News"]
)
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
    saved_news = process_and_save_news(db)

    return {
        "message": "News fetched successfully.",
        "saved_count": len(saved_news)
    }

@router.get("/test-ai")
def test_ai():
    sample_text = """
An improper certificate validation vulnerability in the Prisma Access Agent
for iOS enables an attacker to perform a man-in-the-middle (MitM) attack
to intercept VPN traffic.

The Prisma Access Agent on Windows, macOS, Linux, Android and ChromeOS
are not affected.
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
