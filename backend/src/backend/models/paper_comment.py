
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    func,
)

from backend.db.base import Base


class PaperComment(Base):
    __tablename__ = "paper_comments"

    id = Column(Integer, primary_key=True, index=True)

    paper_id = Column(
        Integer,
        ForeignKey("research_papers.id", ondelete="CASCADE"),
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
    )

    admin_username = Column(String(150), nullable=True)

    comment = Column(Text, nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
