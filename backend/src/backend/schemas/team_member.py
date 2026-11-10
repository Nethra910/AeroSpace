
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TeamMemberBase(BaseModel):
    name: str
    designation: str
    specialization: str
    bio: str
    image_url: str | None = None
    education: str | None = None
    skills: str | None = None
    linkedin_url: str | None = None


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: str | None = None
    designation: str | None = None
    specialization: str | None = None
    bio: str | None = None
    image_url: str | None = None
    education: str | None = None
    skills: str | None = None
    linkedin_url: str | None = None
    is_active: bool | None = None


class TeamMemberResponse(TeamMemberBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
