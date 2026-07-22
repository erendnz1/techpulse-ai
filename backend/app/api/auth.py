from datetime import UTC, datetime, timedelta
from app.schemas.user import ResendVerificationRequest
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import or_
from sqlalchemy.orm import Session
from fastapi import Query
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.email_verification_token import EmailVerificationToken
from app.models.user import User
from app.schemas.user import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    Token,
    UserCreate,
    UserResponse,
)
from app.security.auth import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.services.email_service import (
    send_verification_email,
    send_password_reset_email,
)
from app.models.password_reset_token import PasswordResetToken
from app.core.config import FRONTEND_URL
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register", response_model=UserResponse)
async def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    existing_username = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already registered.",
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    verification = EmailVerificationToken(
        user_id=new_user.id,
        expires_at=datetime.now(UTC) + timedelta(hours=24),
    )

    db.add(verification)
    db.commit()
    db.refresh(verification)

    verification_url = (
    f"{FRONTEND_URL}/verify-email?token={verification.token}"
)

    send_verification_email(
    to_email=new_user.email,
    username=new_user.username,
    verification_url=verification_url,
)

    return new_user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    db_user = db.query(User).filter(
        or_(
            User.email == form_data.username,
            User.username == form_data.username,
        )
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    if not verify_password(
        form_data.password,
        db_user.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # Email doğrulama kontrolü
    if not db_user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email address before logging in.",
        )

    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if not verify_password(
        data.current_password,
        current_user.password,
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect.",
        )

    current_user.password = hash_password(
        data.new_password,
    )

    db.commit()

    return {
        "message": "Password changed successfully.",
    }
@router.get("/verify-email")
def verify_email(
    token: str = Query(...),
    db: Session = Depends(get_db),
):

    verification = (
        db.query(EmailVerificationToken)
        .filter(
            EmailVerificationToken.token == token
        )
        .first()
    )

    if verification is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid verification token.",
        )

    if verification.used:
        raise HTTPException(
            status_code=400,
            detail="Verification token has already been used.",
        )

    if verification.expires_at < datetime.now(UTC):
        raise HTTPException(
            status_code=400,
            detail="Verification token has expired.",
        )

    user = (
        db.query(User)
        .filter(User.id == verification.user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    user.is_verified = True
    user.verified_at = datetime.now(UTC)

    verification.used = True

    db.commit()

    return {
        "message": "Email verified successfully."
    }

@router.post("/resend-verification")
async def resend_verification(
    data: ResendVerificationRequest,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified.",
        )

    # Eski tokenları kullanılamaz yap
    db.query(EmailVerificationToken).filter(
        EmailVerificationToken.user_id == user.id,
        EmailVerificationToken.used == False,
    ).update(
        {
            "used": True
        }
    )

    verification = EmailVerificationToken(
        user_id=user.id,
        expires_at=datetime.now(UTC) + timedelta(hours=24),
    )

    db.add(verification)
    db.commit()
    db.refresh(verification)

    verification_url = (
    f"{FRONTEND_URL}/verify-email?token={verification.token}"
)

    send_verification_email(
    to_email=user.email,
    username=user.username,
    verification_url=verification_url,
)

    return {
        "message": "Verification email sent successfully."
    }

@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    # Güvenlik için kullanıcı yoksa da aynı cevabı dön
    if user is None:
        return {
            "message": "If an account exists for this email, a password reset link has been sent."
        }

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == False,
    ).update(
        {
            "used": True
        }
    )

    reset_token = PasswordResetToken(
        user_id=user.id,
        expires_at=datetime.now(UTC) + timedelta(hours=1),
    )

    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)

    reset_url = (
        f"{FRONTEND_URL}/reset-password?token={reset_token.token}"
    )

    send_password_reset_email(
        to_email=user.email,
        username=user.username,
        reset_url=reset_url,
    )

    return {
        "message": "If an account exists for this email, a password reset link has been sent."
    }


@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):

    token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token == data.token
        )
        .first()
    )

    if token is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid reset token.",
        )

    if token.used:
        raise HTTPException(
            status_code=400,
            detail="Reset token has already been used.",
        )

    if token.expires_at < datetime.now(UTC):
        raise HTTPException(
            status_code=400,
            detail="Reset token has expired.",
        )

    user = (
        db.query(User)
        .filter(User.id == token.user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    user.password = hash_password(
        data.new_password
    )

    token.used = True

    db.commit()

    return {
        "message": "Password has been reset successfully."
    }