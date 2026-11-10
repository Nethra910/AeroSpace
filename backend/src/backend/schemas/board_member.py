
from pydantic import BaseModel, ConfigDict, HttpUrl
from typing import Optional, Literal

BoardMemberRole = Literal["Founder", "Director", "CEO", "COO"]


class BoardMemberBase(BaseModel):
    name: str
    role: Optional[BoardMemberRole] = None
    photo_url: HttpUrl
    linkedin_url: HttpUrl


class BoardMemberCreate(BoardMemberBase):
    pass


class BoardMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[BoardMemberRole] = None
    photo_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None


class BoardMemberResponse(BoardMemberBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
