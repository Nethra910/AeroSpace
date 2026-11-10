
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import io
from fastapi import File, UploadFile
from backend.services.cloudinary import upload_board_member_image

from backend.db.session import get_db
from backend.models.board_member import BoardMember
from backend.schemas.board_member import (
    BoardMemberCreate,
    BoardMemberUpdate,
    BoardMemberResponse,
)
from backend.api.v1.endpoints.auth import get_current_admin

logger = logging.getLogger(__name__)

public_router = APIRouter()
admin_router = APIRouter()


@public_router.get("/", response_model=list[BoardMemberResponse])
def get_board_members(db: Session = Depends(get_db)):
    return (
        db.query(BoardMember)
        .order_by(BoardMember.id.asc())
        .all()
    )


@public_router.get("/{member_id}", response_model=BoardMemberResponse)
def get_board_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(BoardMember).filter(
        BoardMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")

    return member


@admin_router.get("/", response_model=list[BoardMemberResponse])
def get_all_board_members(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    return db.query(BoardMember).order_by(BoardMember.id.asc()).all()


@admin_router.post(
    "/",
    response_model=BoardMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_board_member(
    data: BoardMemberCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = BoardMember(**data.model_dump())

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


@admin_router.put("/{member_id}", response_model=BoardMemberResponse)
def update_board_member(
    member_id: int,
    data: BoardMemberUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = db.query(BoardMember).filter(
        BoardMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)

    return member


@admin_router.delete(
    "/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_board_member(
    member_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = db.query(BoardMember).filter(
        BoardMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")

    db.delete(member)
    db.commit()



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
        image_url = upload_board_member_image(io.BytesIO(image_data))
        return {"image_url": image_url}

    except Exception:
        logger.exception("Board member image upload failed")
        raise HTTPException(
            status_code=500,
            detail="Image upload failed. Check backend logs.",
        )
