
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.crud.user_preferences import get_user_preferences
from app.schemas.news import NewsResponse
from app.models.news import News
from app.database.session import get_db
from app.crud.news import (
    create_news,
    get_news,
    get_news_by_id,
    update_news,
    delete_news,
    get_personalized_news,
    get_security_news,
    get_dashboard_news,
)
from app.schemas.news import (
    NewsCreate,
    NewsResponse,
    NewsUpdate,
)
from app.services.ai_service import analyze_news
from app.services.news_service import (
    process_and_save_news,
    reanalyze_pending_news,
)
from app.crud.news import search_news

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

@router.get("/personalized", response_model=list[NewsResponse])
def get_my_personalized_news(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    preferences = get_user_preferences(db, current_user.id)

    if preferences is None:
        raise HTTPException(
            status_code=404,
            detail="User preferences not found"
        )

    personalized_news = get_personalized_news(
        db=db,
        categories=preferences.categories,
        regions=preferences.regions,
        minimum_importance_score=preferences.minimum_importance_score,
        skip=skip,
        limit=limit
    ) 

    return personalized_news
@router.get("/search", response_model=list[NewsResponse])
def search_news_endpoint(
    q: str = Query(..., min_length=2),
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_news(
        db=db,
        query=q,
        limit=limit,
    )
@router.get("/dashboard", response_model=list[NewsResponse])
def get_dashboard_news_endpoint(
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    preferences = get_user_preferences(
        db,
        current_user.id,
    )

    if preferences is None:
        raise HTTPException(
            status_code=404,
            detail="User preferences not found",
        )

    return get_dashboard_news(
        db=db,
        categories=preferences.categories,
        regions=preferences.regions,
        minimum_importance_score=preferences.minimum_importance_score,
        limit=limit,
    )
@router.get("/", response_model=list[NewsResponse])
@router.get("/", response_model=list[NewsResponse])
def get_all_news(
    category: str | None = None,
    region: str | None = None,
    minimum_importance_score: int | None = None,
    risk_level: str | None = None,
    source: str | None = None,
    search: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_news(
        db=db,
        category=category,
        region=region,
        minimum_importance_score=minimum_importance_score,
        risk_level=risk_level,
        source=source,
        search=search,
        skip=skip,
        limit=limit,
    )
@router.get("/security", response_model=list[NewsResponse])
def get_security_news_endpoint(
    region: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_security_news(
        db=db,
        region=region,
        skip=skip,
        limit=limit,
    )
@router.get("/fetch")
def fetch_news(db: Session = Depends(get_db)):
    saved_news = process_and_save_news(db)

    return {
        "message": "News fetched successfully.",
        "saved_count": len(saved_news)
    }
@router.post("/reanalyze")
def reanalyze_news(
    db: Session = Depends(get_db),
):
    reanalyze_pending_news(db)

    return {
        "message": "Pending news reanalysis completed."
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

@router.get(
    "/releases",
    response_model=list[NewsResponse]
)
def get_latest_releases(
    skip: int = 0,
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    releases = (
        db.query(News)
        .filter(
            News.source == "GitHub Releases"
        )
        .order_by(
    News.importance_score.desc(),
    News.published_at.desc(),
)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return releases