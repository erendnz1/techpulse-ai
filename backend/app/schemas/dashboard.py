from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_news: int
    unread_notifications: int

    categories: dict[str, int]
    risk_levels: dict[str, int]
    sources: dict[str, int]

    ai_articles: int
    cloud_articles: int
    critical_alerts: int

    top_category: str | None
    top_source: str | None