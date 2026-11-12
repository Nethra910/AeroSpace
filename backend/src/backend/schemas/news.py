from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class NewsBase(BaseModel):
    title: str
    category: str
    author: str
    summary: str = Field(..., max_length=300)
    content: str
    image_url: str | None = None


class NewsCreate(NewsBase):
    published: bool = False


class NewsUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    author: str | None = None
    summary: str | None = Field(default=None, max_length=300)
    content: str | None = None
    image_url: str | None = None
    published: bool | None = None


class NewsResponse(NewsBase):
    id: int
    published: bool
    published_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)