
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    func,
)

from backend.db.base import Base


class PaperLike(Base):
    __tablename__ = "paper_likes"

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

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("paper_id", "user_id", name="unique_user_paper_like"),
        UniqueConstraint("paper_id", "admin_username", name="unique_admin_paper_like"),
    )
