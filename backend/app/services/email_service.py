import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import (
    SMTP_FROM,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_USERNAME,
)


def send_email(
    to_email: str,
    subject: str,
    body: str,
):
    message = MIMEMultipart()

    message["From"] = SMTP_FROM
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "html"))

    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD,
        )

        server.sendmail(
            SMTP_FROM,
            to_email,
            message.as_string(),
        )

        server.quit()

        print(f"Email sent to {to_email}")

    except Exception as e:
        print(f"Email sending failed: {e}")
        raise


def send_verification_email(
    to_email: str,
    username: str,
    verification_url: str,
):
    subject = "Verify your TechPulse AI account"

    body = f"""
    <html>
        <body style="font-family:Arial;padding:30px;background:#f8fafc;">

            <div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:12px;">

                <h2 style="color:#2563eb;">
                    Welcome to TechPulse AI 👋
                </h2>

                <p>Hello <b>{username}</b>,</p>

                <p>
                    Thank you for registering.
                </p>

                <p>
                    Please click the button below to verify your email address.
                </p>

                <p style="margin:30px 0;">
                    <a
                        href="{verification_url}"
                        style="
                            background:#2563eb;
                            color:white;
                            padding:14px 24px;
                            border-radius:8px;
                            text-decoration:none;
                            display:inline-block;
                        "
                    >
                        Verify Email
                    </a>
                </p>

                <p>
                    This verification link will expire in <b>24 hours</b>.
                </p>

                <hr>

                <small style="color:#666;">
                    If you did not create this account, you can safely ignore this email.
                </small>

            </div>

        </body>
    </html>
    """

    send_email(
        to_email=to_email,
        subject=subject,
        body=body,
    )


def send_password_reset_email(
    to_email: str,
    username: str,
    reset_url: str,
):
    subject = "Reset your TechPulse AI password"

    body = f"""
    <html>
        <body style="font-family:Arial;padding:30px;background:#f8fafc;">

            <div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:12px;">

                <h2 style="color:#2563eb;">
                    Password Reset Request 🔒
                </h2>

                <p>Hello <b>{username}</b>,</p>

                <p>
                    We received a request to reset your TechPulse AI account password.
                </p>

                <p>
                    Click the button below to create a new password.
                </p>

                <p style="margin:30px 0;">
                    <a
                        href="{reset_url}"
                        style="
                            background:#dc2626;
                            color:white;
                            padding:14px 24px;
                            border-radius:8px;
                            text-decoration:none;
                            display:inline-block;
                        "
                    >
                        Reset Password
                    </a>
                </p>

                <p>
                    This password reset link will expire in <b>1 hour</b>.
                </p>

                <hr>

                <small style="color:#666;">
                    If you did not request a password reset, you can safely ignore this email.
                </small>

            </div>

        </body>
    </html>
    """

    send_email(
        to_email=to_email,
        subject=subject,
        body=body,
    )