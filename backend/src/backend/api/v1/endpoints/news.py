from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.news import News
from backend.schemas.news import NewsCreate, NewsUpdate, NewsResponse

from datetime import datetime

router = APIRouter()


@router.post("/", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
def create_news(data: NewsCreate, db: Session = Depends(get_db)):
    news = News(**data.model_dump())
    db.add(news)
    db.commit()
    db.refresh(news)
    return news


@router.get("/", response_model=list[NewsResponse])
def get_news(db: Session = Depends(get_db)):
    return db.query(News).order_by(News.created_at.desc()).all()


@router.get("/{news_id}", response_model=NewsResponse)
def get_news_by_id(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    return news


@router.put("/{news_id}", response_model=NewsResponse)
def update_news(news_id: int, data: NewsUpdate, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(news, field, value)

    db.commit()
    db.refresh(news)
    return news


@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    db.delete(news)
    db.commit()


@router.patch("/{news_id}/publish", response_model=NewsResponse)
def toggle_news_publish(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()

    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    news.published = not news.published

    if news.published:
        news.published_at = datetime.now()
    else:
        news.published_at = None

    db.commit()
    db.refresh(news)

    return news