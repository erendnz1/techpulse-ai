
import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import FRONTEND_URL
from app.core.config import (
    SMTP_FROM,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_USERNAME,
)
from app.models.news import News


from app.core.config import (
    FRONTEND_URL,
   
)

from app.models.news import News
def send_email(
    to_email: str,
    subject: str,
    body: str,
):
    print("========== SMTP START ==========")
    print("TO =", to_email)

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = SMTP_FROM
    message["To"] = to_email

    message.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(
                SMTP_FROM,
                to_email,
                message.as_string(),
            )

        print("✅ Email sent successfully")

    except Exception as e:
        print("❌ SMTP Error:", e)
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

def send_news_notification_email(
    to_email: str,
    news: News,
):
    print("========== EMAIL FUNCTION STARTED ==========")
    print("TO =", to_email)
    print("TITLE =", news.title)
    print("FRONTEND_URL =", FRONTEND_URL)

    subject = f"🚀 TechPulse AI | {news.category} - {news.title[:60]}"
    article_url = f"{FRONTEND_URL}/dashboard/news/{news.id}"
    print("ARTICLE_URL =", article_url)
    body = f"""
    <html>
    <body
style="
margin:0;
padding:0;
font-family:Arial,sans-serif;
background:
radial-gradient(circle at top right,#2563eb22 0%,transparent 35%),
radial-gradient(circle at bottom left,#7c3aed22 0%,transparent 35%),
linear-gradient(135deg,#0f172a,#111827,#1e293b);
">

    <div
style="
max-width:650px;
margin:40px auto;
background:#f8fbff;
border-radius:18px;
padding:40px;
border:1px solid #dbeafe;
box-shadow:
0 20px 50px rgba(15,23,42,.18);
">

    <h1 style="margin:0;color:#2563eb;">🚀 TechPulse AI</h1>

    <p style="color:#6b7280;margin-top:6px;">
    Technology Intelligence Platform
    </p>

    <hr style="margin:30px 0;">

    <h2 style="margin:0;">🚨 {news.category} Alert</h2>

    <h3 style="margin-top:20px;">
    {news.title}
    </h3>

    <div style="background:#f9fafb;padding:20px;border-radius:10px;margin-top:20px;">
    <b>AI Summary</b>

    <p style="margin-top:10px;">
    {news.summary or "No summary available."}
    </p>
    </div>

    <table style="width:100%;margin-top:25px;">
    <tr>
    <td><b>Category</b></td>
    <td>{news.category}</td>
    </tr>

    <tr>
    <td><b>Importance</b></td>
    <td>{news.importance_score}/10</td>
    </tr>

    <tr>
    <td><b>Risk</b></td>
    <td>{news.risk_level}</td>
    </tr>
    </table>

    <h3 style="margin-top:30px;">🔧 Affected Technologies</h3>

    <ul>
    {"".join(f"<li>{tech}</li>" for tech in (news.affected_technologies or []))}
    </ul>

    <h3>✅ Recommended Action</h3>

    <p>
    {news.recommended_action or "No recommendation available."}
    </p>

    <div style="text-align:center;margin:40px 0;">
    <a
    href="{article_url}"
    style="
    background:#2563eb;
    color:white;
    padding:16px 30px;
    border-radius:10px;
    text-decoration:none;
    font-weight:bold;
    display:inline-block;
    ">
    🚀 Read Full Article
    </a>
    </div>

    <hr>

    <p style="font-size:13px;color:#6b7280;">
    View the complete AI analysis inside TechPulse AI.
    </p>
    <p style="font-size:13px;color:#6b7280;text-align:center;">
Click <b>Read Full Article</b> to view the complete AI analysis, risk assessment,
affected technologies and recommendations inside TechPulse AI.
</p>
    </div>

    </body>
    </html>
    """

    send_email(
        to_email=to_email,
        subject=subject,
        body=body,
    )