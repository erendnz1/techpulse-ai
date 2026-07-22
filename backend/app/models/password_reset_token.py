from datetime import UTC, datetime, timedelta
import secrets

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    token = Column(
        String(255),
        unique=True,
        nullable=False,
        default=lambda: secrets.token_urlsafe(32),
    )

    used = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    expires_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC) + timedelta(hours=1),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="password_reset_tokens",
    )