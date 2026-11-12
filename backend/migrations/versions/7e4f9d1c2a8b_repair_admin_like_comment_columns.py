"""repair admin like and comment columns on upgraded databases

Revision ID: 7e4f9d1c2a8b
Revises: dcda7d5d7c40
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7e4f9d1c2a8b"
down_revision: Union[str, Sequence[str], None] = "dcda7d5d7c40"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    for table in ("paper_comments", "paper_likes"):
        columns = {column["name"] for column in inspector.get_columns(table)}
        if "admin_username" not in columns:
            op.add_column(
                table,
                sa.Column("admin_username", sa.String(length=150), nullable=True),
            )

    indexes = {
        index["name"]
        for index in sa.inspect(op.get_bind()).get_indexes("paper_likes")
    }
    constraints = {
        constraint["name"]
        for constraint in sa.inspect(op.get_bind()).get_unique_constraints("paper_likes")
    }
    if "unique_admin_paper_like" not in constraints:
        op.create_unique_constraint(
            "unique_admin_paper_like",
            "paper_likes",
            ["paper_id", "admin_username"],
        )
    if "unique_user_paper_like" not in constraints:
        op.create_unique_constraint(
            "unique_user_paper_like",
            "paper_likes",
            ["paper_id", "user_id"],
        )


def downgrade() -> None:
    op.drop_constraint("unique_user_paper_like", "paper_likes", type_="unique")
    op.drop_constraint("unique_admin_paper_like", "paper_likes", type_="unique")
    op.drop_column("paper_likes", "admin_username")
    op.drop_column("paper_comments", "admin_username")
