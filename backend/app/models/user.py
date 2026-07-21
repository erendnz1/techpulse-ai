from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    role = Column(String(20), nullable=False, default="user")

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    preferences = relationship(
        "UserPreferences",
        back_populates="user",
        uselist=False,
    )