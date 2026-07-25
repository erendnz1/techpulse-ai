from sqlalchemy.orm import Session

from app.models.feedback import Feedback
from app.models.user import User
from app.schemas.feedback import FeedbackCreate


def create_feedback(
    db: Session,
    user: User,
    feedback: FeedbackCreate,
):
    new_feedback = Feedback(
        user_id=user.id,
        rating=feedback.rating,
        message=feedback.message,
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback


def get_user_feedbacks(
    db: Session,
    user: User,
):
    return (
        db.query(Feedback)
        .filter(Feedback.user_id == user.id)
        .order_by(Feedback.created_at.desc())
        .all()
    )


def get_all_feedbacks(db: Session):
    return (
        db.query(Feedback)
        .order_by(Feedback.created_at.desc())
        .all()
    )