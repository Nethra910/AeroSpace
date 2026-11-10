from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.news import News
from backend.schemas.news import NewsCreate, NewsUpdate, NewsResponse
from backend.api.v1.endpoints.auth import get_current_admin
from backend.services.cloudinary import upload_news_image

import io
import logging

logger = logging.getLogger(__name__)

public_router = APIRouter()
admin_router = APIRouter()


@public_router.get("/", response_model=list[NewsResponse])
def get_news(db: Session = Depends(get_db)):
    return (
        db.query(News)
        .filter(News.published.is_(True))
        .order_by(News.published_at.desc())
        .all()
    )


@public_router.get("/{news_id}", response_model=NewsResponse)
def get_news_by_id(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(
        News.id == news_id,
        News.published.is_(True)
    ).first()

    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    return news


@admin_router.get("/", response_model=list[NewsResponse])
def get_all_news(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    return db.query(News).order_by(News.created_at.desc()).all()


@admin_router.post("/", response_model=NewsResponse, status_code=201)
def create_news(
    data: NewsCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    news = News(**data.model_dump())
    db.add(news)
    db.commit()
    db.refresh(news)
    return news


@admin_router.put("/{news_id}", response_model=NewsResponse)
def update_news(
    news_id: int,
    data: NewsUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(news, field, value)

    db.commit()
    db.refresh(news)
    return news


@admin_router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    db.delete(news)
    db.commit()


@admin_router.patch("/{news_id}/publish", response_model=NewsResponse)
def toggle_news_publish(
    news_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    news.published = not news.published
    news.published_at = datetime.now(timezone.utc) if news.published else None

    db.commit()
    db.refresh(news)
    return news

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
        image_url = upload_news_image(io.BytesIO(image_data))
        return {"image_url": image_url}

    except Exception:
        logger.exception("Cloudinary image upload failed")
        raise HTTPException(
            status_code=500,
            detail="Image upload failed. Check backend logs.",
        )