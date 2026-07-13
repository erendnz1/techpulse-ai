from sqlalchemy import Column, Integer, Boolean, ForeignKey, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from app.database.base import Base

class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )
    categories = Column(
    ARRAY(String),
    nullable=False,
    default=list
    )
    regions = Column(
    ARRAY(String),
    nullable=False,
    default=list
    )
    minimum_importance_score = Column(
    Integer,
    nullable=False,
    default=1
    )
    notification_enabled = Column(
    Boolean,
    nullable=False,
    default=True
    )
    user = relationship(
    "User",
    back_populates="preferences"
    )  