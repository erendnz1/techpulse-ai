"""add analytics fields to users

Revision ID: c959c25ba42d
Revises: 991f4906ddd2
Create Date: 2026-07-23 15:59:57.914228

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c959c25ba42d'
down_revision: Union[str, Sequence[str], None] = '991f4906ddd2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("date_of_birth", sa.Date(), nullable=True),
    )

    op.add_column(
        "users",
        sa.Column("country", sa.String(length=100), nullable=True),
    )

    op.add_column(
        "users",
        sa.Column("city", sa.String(length=100), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "city")
    op.drop_column("users", "country")
    op.drop_column("users", "date_of_birth")