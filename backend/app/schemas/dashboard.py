from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_news: int
    unread_notifications: int
    categories: dict
    risk_levels: dict
    sources: dict