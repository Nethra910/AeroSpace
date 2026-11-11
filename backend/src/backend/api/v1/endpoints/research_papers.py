
from io import BytesIO
from math import ceil
from sqlalchemy import func, or_

import jwt

from sqlalchemy import exists, literal
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.core.config import settings
from backend.services.auth import decode_access_token, decode_user_access_token
import cloudinary
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.research_paper import ResearchPaper
from backend.models.paper_like import PaperLike
from backend.models.paper_comment import PaperComment

from backend.schemas.research_paper import (
    ResearchPaperCreate,
    ResearchPaperResponse,
    ResearchPaperReview,
    PublicResearchPaperResponse,
    PaperCommentCreate,
    PaperCommentResponse,
)

from backend.api.v1.endpoints.users import get_current_user
from backend.api.v1.endpoints.auth import get_current_admin
from backend.models.user import User

from sqlalchemy import func



user_router = APIRouter()
admin_router = APIRouter()
public_router = APIRouter()

optional_security = HTTPBearer(auto_error=False)


def get_optional_identity(
    credentials: HTTPAuthorizationCredentials = Depends(optional_security),
    db: Session = Depends(get_db),
):
    if not credentials:
        return None

    token = credentials.credentials

    try:
        payload = decode_access_token(token)

        if payload.get("type") == "user":
            user_payload = decode_user_access_token(token)
            user_id = int(user_payload.get("sub"))

            user = db.query(User).filter(
                User.id == user_id,
                User.is_active == True
            ).first()

            if not user:
                raise HTTPException(status_code=401, detail="User not found or inactive")

            return {"type": "user", "id": user.id}

        if payload.get("sub") == settings.ADMIN_USERNAME:
            return {"type": "admin", "username": payload["sub"]}

        raise HTTPException(status_code=401, detail="Invalid token")

    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")


MAX_FILE_SIZE = 20 * 1024 * 1024


async def upload_pdf(file: UploadFile):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed",
        )

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Invalid file type",
        )

    contents = await file.read(MAX_FILE_SIZE + 1)

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="PDF size cannot exceed 20 MB",
        )

    if not contents.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file",
        )

    try:
        result = cloudinary.uploader.upload(
            BytesIO(contents),
            folder="mani-aerospace/research-papers",
            resource_type="raw",
            use_filename=True,
            unique_filename=True,
        )

        return {
            "pdf_url": result["secure_url"],
            "public_id": result["public_id"],
        }

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="PDF upload failed",
        )


@user_router.post("/upload")
async def upload_user_paper(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    return await upload_pdf(file)


@admin_router.post("/upload")
async def upload_admin_paper(
    file: UploadFile = File(...),
    admin: dict = Depends(get_current_admin),
):
    return await upload_pdf(file)



@user_router.post(
    "/",
    response_model=ResearchPaperResponse,
)
def submit_user_paper(
    data: ResearchPaperCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    paper = ResearchPaper(
        title=data.title,
        abstract=data.abstract,
        authors=data.authors,
        affiliation=data.affiliation,
        keywords=data.keywords,
        pdf_url=data.pdf_url,
        submitted_by=current_user.id,
        is_admin_submission=False,
        status="pending",
    )

    db.add(paper)
    db.commit()
    db.refresh(paper)

    return paper


@admin_router.post(
    "/",
    response_model=ResearchPaperResponse,
)
def submit_admin_paper(
    data: ResearchPaperCreate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    paper = ResearchPaper(
        title=data.title,
        abstract=data.abstract,
        authors=data.authors,
        affiliation=data.affiliation,
        keywords=data.keywords,
        pdf_url=data.pdf_url,
        submitted_by=None,
        is_admin_submission=True,
        status="approved",
        reviewed_at=datetime.now(timezone.utc).replace(tzinfo=None),
        reviewed_by=admin["username"],
    )

    db.add(paper)
    db.commit()
    db.refresh(paper)

    return paper


@public_router.get("/")
def get_published_papers(
    search: str = "",
    page: int = 1,
    limit: int = 10,
    identity: dict | None = Depends(get_optional_identity),
    db: Session = Depends(get_db),
):
    if page < 1 or limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Invalid page or limit. Limit must be between 1 and 100.",
        )

    query = db.query(ResearchPaper).filter(
        ResearchPaper.status == "approved"
    )

    if search.strip():
        keyword = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ResearchPaper.title.ilike(keyword),
                ResearchPaper.authors.ilike(keyword),
                ResearchPaper.abstract.ilike(keyword),
                ResearchPaper.keywords.ilike(keyword),
            )
        )

    total = query.count()

    likes_count = (
        db.query(func.count(PaperLike.id))
        .filter(PaperLike.paper_id == ResearchPaper.id)
        .correlate(ResearchPaper)
        .scalar_subquery()
    )

    comments_count = (
        db.query(func.count(PaperComment.id))
        .filter(PaperComment.paper_id == ResearchPaper.id)
        .correlate(ResearchPaper)
        .scalar_subquery()
    )

    is_liked = literal(False)

    if identity and identity["type"] == "user":
        is_liked = exists().where(
            PaperLike.paper_id == ResearchPaper.id,
            PaperLike.user_id == identity["id"],
        )

    elif identity and identity["type"] == "admin":
        is_liked = exists().where(
            PaperLike.paper_id == ResearchPaper.id,
            PaperLike.admin_username == identity["username"],
        )

    results = (
        db.query(
            ResearchPaper,
            likes_count.label("likes_count"),
            comments_count.label("comments_count"),
            is_liked.label("is_liked"),
        )
        .filter(
            ResearchPaper.id.in_(
                query.with_entities(ResearchPaper.id)
            )
        )
        .order_by(ResearchPaper.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    papers = []

    for paper, likes, comments, liked in results:
        paper.likes_count = likes
        paper.comments_count = comments
        paper.is_liked = bool(liked)
        papers.append(paper)

    return {
        "items": papers,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": ceil(total / limit) if total else 0,
    }

@admin_router.patch(
    "/{paper_id}/review",
    response_model=ResearchPaperResponse,
)
def review_research_paper(
    paper_id: int,
    data: ResearchPaperReview,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    paper = db.query(ResearchPaper).filter(
        ResearchPaper.id == paper_id
    ).first()

    if not paper:
        raise HTTPException(
            status_code=404,
            detail="Research paper not found",
        )

    if paper.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending papers can be reviewed",
        )

    if data.status == "rejected" and not data.rejection_reason:
        raise HTTPException(
            status_code=400,
            detail="Rejection reason is required",
        )

    paper.status = data.status
    paper.rejection_reason = (
        data.rejection_reason if data.status == "rejected" else None
    )
    paper.reviewed_at = datetime.now(timezone.utc).replace(tzinfo=None)
    paper.reviewed_by = admin["username"]

    db.commit()
    db.refresh(paper)

    return paper

@user_router.post("/{paper_id}/like")
def like_paper(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    paper = db.query(ResearchPaper).filter(
        ResearchPaper.id == paper_id,
        ResearchPaper.status == "approved",
    ).first()

    if not paper:
        raise HTTPException(status_code=404, detail="Published paper not found")

    existing_like = db.query(PaperLike).filter(
        PaperLike.paper_id == paper_id,
        PaperLike.user_id == current_user.id,
    ).first()

    if existing_like:
        raise HTTPException(status_code=409, detail="Paper already liked")

    like = PaperLike(
        paper_id=paper_id,
        user_id=current_user.id,
    )

    db.add(like)
    db.commit()

    return {"message": "Paper liked successfully"}


@user_router.delete("/{paper_id}/like")
def unlike_paper(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    like = db.query(PaperLike).filter(
        PaperLike.paper_id == paper_id,
        PaperLike.user_id == current_user.id,
    ).first()

    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    db.delete(like)
    db.commit()

    return {"message": "Like removed successfully"}

@admin_router.post("/{paper_id}/like")
def admin_like_paper(
    paper_id: int,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    paper = db.query(ResearchPaper).filter(
        ResearchPaper.id == paper_id,
        ResearchPaper.status == "approved",
    ).first()

    if not paper:
        raise HTTPException(status_code=404, detail="Published paper not found")

    existing_like = db.query(PaperLike).filter(
        PaperLike.paper_id == paper_id,
        PaperLike.admin_username == admin["username"],
    ).first()

    if existing_like:
        raise HTTPException(status_code=409, detail="Paper already liked")

    like = PaperLike(
        paper_id=paper_id,
        admin_username=admin["username"],
    )

    db.add(like)
    db.commit()

    return {"message": "Paper liked successfully"}


@admin_router.delete("/{paper_id}/like")
def admin_unlike_paper(
    paper_id: int,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    like = db.query(PaperLike).filter(
        PaperLike.paper_id == paper_id,
        PaperLike.admin_username == admin["username"],
    ).first()

    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    db.delete(like)
    db.commit()

    return {"message": "Like removed successfully"}

@user_router.post(
    "/{paper_id}/comments",
    response_model=PaperCommentResponse,
)
def add_user_comment(
    paper_id: int,
    data: PaperCommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    paper = db.query(ResearchPaper).filter(
        ResearchPaper.id == paper_id,
        ResearchPaper.status == "approved",
    ).first()

    if not paper:
        raise HTTPException(status_code=404, detail="Published paper not found")

    comment = PaperComment(
        paper_id=paper_id,
        user_id=current_user.id,
        comment=data.comment,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment

@admin_router.post(
    "/{paper_id}/comments",
    response_model=PaperCommentResponse,
)
def add_admin_comment(
    paper_id: int,
    data: PaperCommentCreate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    paper = db.query(ResearchPaper).filter(
        ResearchPaper.id == paper_id,
        ResearchPaper.status == "approved",
    ).first()

    if not paper:
        raise HTTPException(status_code=404, detail="Published paper not found")

    comment = PaperComment(
        paper_id=paper_id,
        admin_username=admin["username"],
        comment=data.comment,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment

@public_router.get(
    "/{paper_id}/comments",
    response_model=list[PaperCommentResponse],
)
def get_paper_comments(
    paper_id: int,
    db: Session = Depends(get_db),
):
    paper = db.query(ResearchPaper).filter(
        ResearchPaper.id == paper_id,
        ResearchPaper.status == "approved",
    ).first()

    if not paper:
        raise HTTPException(status_code=404, detail="Published paper not found")

    return (
        db.query(PaperComment)
        .filter(PaperComment.paper_id == paper_id)
        .order_by(PaperComment.created_at.asc())
        .all()
    )

@user_router.delete("/{paper_id}/comments/{comment_id}")
def delete_user_comment(
    paper_id: int,
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    comment = db.query(PaperComment).filter(
        PaperComment.id == comment_id,
        PaperComment.paper_id == paper_id,
        PaperComment.user_id == current_user.id,
    ).first()

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found or you are not authorized to delete it",
        )

    db.delete(comment)
    db.commit()

    return {"message": "Comment deleted successfully"}

@admin_router.delete("/{paper_id}/comments/{comment_id}")
def admin_delete_comment(
    paper_id: int,
    comment_id: int,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    comment = db.query(PaperComment).filter(
        PaperComment.id == comment_id,
        PaperComment.paper_id == paper_id,
    ).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db.delete(comment)
    db.commit()

    return {"message": "Comment deleted successfully"}