
from sqlalchemy import Column, Integer, String, DateTime, func

from backend.db.base import Base


class BoardMember(Base):
    __tablename__ = "board_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    role = Column(String(50), nullable=True)
    photo_url = Column(String(500), nullable=False)
    linkedin_url = Column(String(500), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
