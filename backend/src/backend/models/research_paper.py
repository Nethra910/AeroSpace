
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    func,
)

from backend.db.base import Base


class ResearchPaper(Base):
    __tablename__ = "research_papers"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    abstract = Column(Text, nullable=False)

    authors = Column(Text, nullable=False)
    affiliation = Column(String(255), nullable=True)
    keywords = Column(Text, nullable=True)

    pdf_url = Column(String(1000), nullable=False)

    submitted_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    is_admin_submission = Column(Boolean, default=False, nullable=False)

    status = Column(
        String(20),
        default="pending",
        nullable=False,
        index=True,
    )

    rejection_reason = Column(Text, nullable=True)

    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(String(150), nullable=True)

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
