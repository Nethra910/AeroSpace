from pydantic import BaseModel, ConfigDict


class HomeContentBase(BaseModel):
    title: str
    subtitle: str
    description: str


class HomeContentUpdate(HomeContentBase):
    pass


class HomeContentResponse(HomeContentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class MissionContentBase(BaseModel):
    title: str
    description: str


class MissionContentUpdate(MissionContentBase):
    pass


class MissionContentResponse(MissionContentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)