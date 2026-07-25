"""Add feedback status and admin note

Revision ID: f59069b33567
Revises: c959c25ba42d
Create Date: 2026-07-25 20:03:22.131304

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "f59069b33567"
down_revision: Union[str, Sequence[str], None] = "c959c25ba42d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "feedback",
        sa.Column("status", sa.String(length=20), nullable=True),
    )

    op.add_column(
        "feedback",
        sa.Column("admin_note", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("feedback", "admin_note")
    op.drop_column("feedback", "status")