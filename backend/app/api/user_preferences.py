from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.crud.user_preferences import (
    get_user_preferences,
    create_user_preferences,
    update_user_preferences,
)

from app.schemas.user_preferences import (
    UserPreferencesCreate,
    UserPreferencesResponse,
    UserPreferencesUpdate,
)


router = APIRouter(
    prefix="/preferences",
    tags=["User Preferences"]
)

@router.get("/me", response_model=UserPreferencesResponse)
def get_my_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    preferences = get_user_preferences(
        db,
        current_user.id
    )

    if preferences is None:
        raise HTTPException(
            status_code=404,
            detail="User preferences not found"
        )

    return preferences

@router.post("/me", response_model=UserPreferencesResponse)
def create_my_preferences(
    preferences: UserPreferencesCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_preferences = get_user_preferences(
        db,
        current_user.id
    )

    if existing_preferences:
        raise HTTPException(
            status_code=400,
            detail="User preferences already exist"
        )

    return create_user_preferences(
        db,
        current_user.id,
        preferences
    )

@router.put("/me", response_model=UserPreferencesResponse)
def update_my_preferences(
    preferences: UserPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_preferences = get_user_preferences(
        db,
        current_user.id
    )

    if existing_preferences is None:
        raise HTTPException(
            status_code=404,
            detail="User preferences not found"
        )

    return update_user_preferences(
        db,
        existing_preferences,
        preferences
    )