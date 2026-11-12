
from datetime import datetime, timedelta, timezone

import cloudinary
import cloudinary.uploader
import jwt
from backend.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_news_image(file):
    result = cloudinary.uploader.upload(
        file,
        folder="mani-aerospace/news",
        resource_type="image",
    )

    return result["secure_url"]


def upload_team_member_image(file):
    result = cloudinary.uploader.upload(
        file,
        folder="mani-aerospace/team",
        resource_type="image",
    )

    return result["secure_url"]


def upload_board_member_image(file):
    result = cloudinary.uploader.upload(
        file,
        folder="mani-aerospace/board-members",
        resource_type="image",
    )

    return result["secure_url"]

def upload_research_paper_pdf(file):
    result = cloudinary.uploader.upload(
        file,
        folder="mani-aerospace/research-papers",
        resource_type="raw",
    )

    return result["secure_url"]


def create_upload_ticket(public_id: str, pdf_url: str, subject: str) -> str:
    return jwt.encode(
        {
            "type": "research-paper-upload",
            "public_id": public_id,
            "pdf_url": pdf_url,
            "sub": subject,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        },
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def verify_upload_ticket(token: str, subject: str) -> dict:
    payload = jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )
    if payload.get("type") != "research-paper-upload" or payload.get("sub") != subject:
        raise jwt.InvalidTokenError("Invalid upload ticket")
    return payload


def delete_research_paper_file(public_id: str) -> dict:
    return cloudinary.uploader.destroy(public_id, resource_type="raw")
