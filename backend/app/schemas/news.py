from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NewsCreate(BaseModel):
    title: str
    content: str
    summary: str | None = None
    category: str | None = None
    importance_score: int | None = None
    risk_level: str | None = None
    source: str
    url: str
    image_url: str | None = None
    author: str | None = None
    published_at: datetime


class NewsResponse(BaseModel):
    id: int
    title: str
    content: str
    summary: str | None = None
    source: str
    url: str
    image_url: str | None = None
    author: str | None = None
    category: str | None = None
    importance_score: int | None = None
    risk_level: str | None = None
    published_at: datetime
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class NewsUpdate(BaseModel):
    title: str
    content: str
    summary: str | None = None
    category: str | None = None
    source: str
    url: str
    image_url: str | None = None
    author: str | None = None
    published_at: datetime