from pydantic import BaseModel


class UserPreferencesCreate(BaseModel):
    categories: list[str]
    regions: list[str]
    minimum_importance_score: int = 1
    notification_enabled: bool = True
    email_notification_enabled: bool = False

class UserPreferencesResponse(BaseModel):
    id: int
    user_id: int
    categories: list[str]
    regions: list[str]
    minimum_importance_score: int
    notification_enabled: bool
    email_notification_enabled: bool = False
    model_config = {
        "from_attributes": True
    }

    
class UserPreferencesUpdate(BaseModel):
    categories: list[str] | None = None
    regions: list[str] | None = None
    minimum_importance_score: int | None = None
    notification_enabled: bool | None = None
    email_notification_enabled: bool = False