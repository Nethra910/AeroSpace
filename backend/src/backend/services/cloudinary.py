import cloudinary
import cloudinary.uploader
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