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
def fetch_news():
    return fetch_technology_news()


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
