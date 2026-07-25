from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User

from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackResponse,
)

from app.crud.feedback import (
    create_feedback,
    get_user_feedbacks,
    get_all_feedbacks,
)

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"],
)


@router.post(
    "",
    response_model=FeedbackResponse,
)
def create_new_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_feedback(
        db,
        current_user,
        feedback,
    )

@router.get(
    "/admin",
    response_model=list[FeedbackResponse],
)
def all_feedbacks(
    db: Session = Depends(get_db),
):
    feedbacks = get_all_feedbacks(db)

    for f in feedbacks:
        print("ID:", f.id)
        print("STATUS:", repr(f.status))
        print("ADMIN_NOTE:", repr(f.admin_note))

    return feedbacks