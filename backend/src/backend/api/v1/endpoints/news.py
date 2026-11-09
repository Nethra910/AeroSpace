from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.news import News
from backend.schemas.news import NewsCreate, NewsUpdate, NewsResponse
from backend.api.v1.endpoints.auth import get_current_admin

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