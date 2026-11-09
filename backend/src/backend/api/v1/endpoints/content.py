from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.content import HomeContent, MissionContent
from backend.schemas.content import (
    HomeContentUpdate,
    HomeContentResponse,
    MissionContentUpdate,
    MissionContentResponse,
)

from backend.api.v1.endpoints.auth import get_current_admin

router = APIRouter()


@router.get("/home", response_model=HomeContentResponse)
def get_home(db: Session = Depends(get_db)):
    content = db.query(HomeContent).first()
    if not content:
        raise HTTPException(status_code=404, detail="Home content not found")
    return content


@router.put("/home", response_model=HomeContentResponse)
def update_home(data: HomeContentUpdate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    content = db.query(HomeContent).first()
    if not content:
        content = HomeContent(**data.model_dump())
        db.add(content)
    else:
        for key, value in data.model_dump().items():
            setattr(content, key, value)

    db.commit()
    db.refresh(content)
    return content


@router.get("/mission", response_model=MissionContentResponse)
def get_mission(db: Session = Depends(get_db)):
    content = db.query(MissionContent).first()
    if not content:
        raise HTTPException(status_code=404, detail="Mission content not found")
    return content


@router.put("/mission", response_model=MissionContentResponse)
def update_mission(data: MissionContentUpdate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    content = db.query(MissionContent).first()
    if not content:
        content = MissionContent(**data.model_dump())
        db.add(content)
    else:
        for key, value in data.model_dump().items():
            setattr(content, key, value)

    db.commit()
    db.refresh(content)
    return content