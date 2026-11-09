from fastapi import APIRouter
from backend.api.v1.endpoints import health, news, content, auth

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(news.router, prefix="/news", tags=["News"])
api_router.include_router(content.router, prefix="/content", tags=["Content"])