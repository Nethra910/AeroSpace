
from fastapi import APIRouter
from backend.api.v1.endpoints import health, news, content, auth, team_members, board_members, users

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

api_router.include_router(news.public_router, prefix="/news", tags=["Public News"])
api_router.include_router(news.admin_router, prefix="/admin/news", tags=["Admin News"])

api_router.include_router(content.router, prefix="/content", tags=["Content"])

api_router.include_router(team_members.public_router, prefix="/team-members", tags=["Public Team"])
api_router.include_router(team_members.admin_router, prefix="/admin/team-members", tags=["Admin Team"])

api_router.include_router(
    board_members.public_router,
    prefix="/board-members",
    tags=["Public Board Members"]
)

api_router.include_router(
    board_members.admin_router,
    prefix="/admin/board-members",
    tags=["Admin Board Members"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["User Authentication"]
)
