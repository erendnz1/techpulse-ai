from datetime import datetime, UTC

from sqlalchemy import Column, Integer, String, Text, DateTime, JSON

from app.database.base import Base


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    content = Column(Text, nullable=False)

    summary = Column(Text, nullable=True)

    source = Column(String(100), nullable=False)

    url = Column(String(500), unique=True, nullable=False)

    image_url = Column(String(500), nullable=True)

    author = Column(String(100), nullable=True)

    category = Column(String(50), nullable=True)
    
    importance_score = Column(Integer, nullable=True)

    risk_level = Column(String(20), nullable=True)

    affected_technologies = Column(JSON, nullable=True)

    recommended_action = Column(Text, nullable=True)

    published_at = Column(DateTime, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    region = Column(String(20), nullable=False, default="global")