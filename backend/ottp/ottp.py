import random
import string
import smtplib
import os
from dotenv import load_dotenv

# Load env variables from backend/.env
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))


def generate_random_password(length=6):
    """
    Generates a 6-character random verification code.
    """
    allowed_punctuations = "!@#*%$"
    characters = string.ascii_letters + string.digits + allowed_punctuations
    secure_random = random.SystemRandom()
    return ''.join(secure_random.choice(characters) for _ in range(length))


def send_mail(password, receiver):
    """
    Dispatches OTP verification email to user
    """
    sender = os.getenv("SMTP_SENDER_EMAIL", "tubabintenaushad@gmail.com")
    raw_pwd = os.getenv("SMTP_APP_PASSWORD", "fqevvglbzhprnxkm")
    app_password = raw_pwd.replace(" ", "")
    email_receiver = receiver

    message = (
        f"From: Investify App <{sender}>\n"
        f"To: {email_receiver}\n"
        f"Subject: Investify - Password Reset OTP Code\n\n"
        f"Hello,\n\n"
        f"Your verification code for Investify App password reset is: {password}\n\n"
        f"NOTE: This code remains valid for 2 minutes.\n\n"
        f"Regards,\nInvestify Security Team"
    )

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender, app_password)
        server.sendmail(sender, [email_receiver], message)
        print("[OK] OTP Email sent successfully to:", email_receiver)
        return True
    except Exception as e:
        print("[ERROR] OTP Email dispatch failed:", e)
        return False
    finally:
        try:
            server.quit()
        except Exception:
            pass


def send_support_query(name, sender_email, category, user_message):
    """
    Dispatches support query ticket directly to admin Gmail via SMTP
    """
    receiver = os.getenv("SMTP_SENDER_EMAIL", "tubabintenaushad@gmail.com")
    raw_pwd = os.getenv("SMTP_APP_PASSWORD", "fqevvglbzhprnxkm")
    app_password = raw_pwd.replace(" ", "")

    subject = f"Investify Support Ticket: {category} from {name}"
    body = (
        f"From: Investify Support <{receiver}>\n"
        f"To: {receiver}\n"
        f"Subject: {subject}\n\n"
        f"New Support Ticket Submission on Investify Platform!\n\n"
        f"User Name: {name}\n"
        f"User Email: {sender_email}\n"
        f"Category: {category}\n\n"
        f"User Query Message:\n"
        f"--------------------------------------------------\n"
        f"{user_message}\n"
        f"--------------------------------------------------\n\n"
        f"Investify Support Telemetry System"
    )

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(receiver, app_password)
        server.sendmail(receiver, [receiver], body.encode('utf-8'))
        print("[OK] Support query email sent to Gmail successfully!")
        return True
    except Exception as e:
        print("[ERROR] Support query email dispatch failed:", e)
        return False
    finally:
        try:
            server.quit()
        except Exception:
            pass
