
import io
import logging

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.team_member import TeamMember
from backend.schemas.team_member import (
    TeamMemberCreate,
    TeamMemberUpdate,
    TeamMemberResponse,
)
from backend.api.v1.endpoints.auth import get_current_admin
from backend.services.cloudinary import upload_team_member_image

logger = logging.getLogger(__name__)

public_router = APIRouter()
admin_router = APIRouter()


@public_router.get("/", response_model=list[TeamMemberResponse])
def get_team_members(db: Session = Depends(get_db)):
    return (
        db.query(TeamMember)
        .filter(TeamMember.is_active.is_(True))
        .order_by(TeamMember.id.asc())
        .all()
    )


@public_router.get("/{member_id}", response_model=TeamMemberResponse)
def get_team_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(
        TeamMember.id == member_id,
        TeamMember.is_active.is_(True)
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    return member


@admin_router.get("/", response_model=list[TeamMemberResponse])
def get_all_team_members(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    return db.query(TeamMember).order_by(TeamMember.id.asc()).all()


@admin_router.post("/", response_model=TeamMemberResponse, status_code=201)
def create_team_member(
    data: TeamMemberCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = TeamMember(**data.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@admin_router.put("/{member_id}", response_model=TeamMemberResponse)
def update_team_member(
    member_id: int,
    data: TeamMemberUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()

    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)
    return member


@admin_router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team_member(
    member_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()

    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    db.delete(member)
    db.commit()


@admin_router.patch("/{member_id}/status", response_model=TeamMemberResponse)
def toggle_team_member_status(
    member_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()

    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    member.is_active = not member.is_active

    db.commit()
    db.refresh(member)
    return member


@admin_router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    admin: dict = Depends(get_current_admin),
):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed",
        )

    image_data = await file.read()

    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image size must be less than 5 MB",
        )

    try:
        image_url = upload_team_member_image(io.BytesIO(image_data))
        return {"image_url": image_url}

    except Exception:
        logger.exception("Team member image upload failed")
        raise HTTPException(
            status_code=500,
            detail="Image upload failed. Check backend logs.",
        )
