from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    message: str = Field(..., min_length=5, max_length=1000)


class FeedbackResponse(BaseModel):
    id: int
    user_id: int
    rating: int
    message: str
    status: str
    admin_note: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
class FeedbackUpdate(BaseModel):
    status: str
    admin_note: str | None = None