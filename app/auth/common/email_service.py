import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

SMTP_USER = os.getenv("SMTP_USER")  # login username
SMTP_PASS = os.getenv("SMTP_PASS")

FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@amcart.com")  # actual sender email


def send_otp_email(email: str, otp: str):

    msg = MIMEMultipart()
    msg["From"] = formataddr(("AmCart Admin", FROM_EMAIL))
    msg["To"] = email
    msg["Subject"] = "Your AmCart OTP Code"

    html = f"""
    <h2>AmCart Verification Code</h2>
    <p>Your OTP for login is:</p>
    <h1>{otp}</h1>
    <p>This code will expire in 5 minutes.</p>
    <p>Thanks,<br>AmCart Admin</p>
    """

    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()

            # login using SMTP credentials
            server.login(SMTP_USER, SMTP_PASS)

            # send using real email address
            server.sendmail(FROM_EMAIL, [email], msg.as_string())

        print(f"[EMAIL SENT] OTP sent to {email}")

    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
