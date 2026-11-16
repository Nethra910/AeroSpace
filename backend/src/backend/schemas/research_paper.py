
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ResearchPaperCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(..., min_length=5, max_length=255)
    abstract: str = Field(..., min_length=50)
    authors: str = Field(..., min_length=2, max_length=1000)
    affiliation: Optional[str] = Field(default=None, max_length=255)
    keywords: Optional[str] = Field(default=None, max_length=1000)
    pdf_url: str = Field(..., min_length=1, max_length=1000)
    cloudinary_public_id: str = Field(..., min_length=1, max_length=500)


class ResearchPaperResponse(BaseModel):
    id: int
    title: str
    abstract: str
    authors: str
    affiliation: Optional[str]
    keywords: Optional[str]
    pdf_url: str
    cloudinary_public_id: Optional[str] = None
    submitted_by: Optional[int]
    is_admin_submission: bool
    status: str
    rejection_reason: Optional[str]
    reviewed_at: Optional[datetime]
    reviewed_by: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResearchPaperReview(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected)$")
    rejection_reason: Optional[str] = None

class PaperCommentCreate(BaseModel):
    comment: str = Field(..., min_length=1, max_length=3000)



class PaperCommentResponse(BaseModel):
    id: int
    paper_id: int
    user_id: Optional[int]
    admin_username: Optional[str]
    user_name: Optional[str] = None
    comment: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublicResearchPaperResponse(BaseModel):
    id: int
    title: str
    abstract: str
    authors: str
    affiliation: Optional[str]
    keywords: Optional[str]
    pdf_url: str
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False

    model_config = ConfigDict(from_attributes=True)


class PublicResearchPaperListResponse(BaseModel):
    items: list[PublicResearchPaperResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class PublicPaperCommentResponse(BaseModel):
    id: int
    paper_id: int
    user_name: Optional[str] = None
    comment: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)