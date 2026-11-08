from fastapi import APIRouter
from backend.api.v1.endpoints import health, news

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(news.router, prefix="/news", tags=["News"])