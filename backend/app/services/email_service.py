import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import (
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_FROM,
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