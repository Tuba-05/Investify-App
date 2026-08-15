import random
import string
import smtplib
import os

def generate_random_password(length=6):
    """
    Generates a random password of a specified length.
    By default, it generates a 6-character password.
    """
    allowed_punctuations = "!@#*%$"
    characters = string.ascii_letters + string.digits + allowed_punctuations
    secure_random = random.SystemRandom()
    password = ''.join(secure_random.choice(characters) for _ in range(length))
    return password


def send_mail(password, receiver):
    sender = os.getenv("SMTP_SENDER_EMAIL", "tubabintenaushad@gmail.com")
    app_password = os.getenv("SMTP_APP_PASSWORD", "jlgo kkjo jsii wudg")
    email_receiver = receiver

    message = f"Subject:Forgot password Verification Code\n\nThis is your verification code for Investify App login {password}\n NOTE: this code will be active for 2 minutes."

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender, app_password)
        server.sendmail(sender, email_receiver, message)
        print("✅ OTP Email sent successfully!")
    except Exception as e:
        print("⚠️ OTP Email Error:", e)
    finally:
        try:
            server.quit()
        except Exception:
            pass


def send_support_query(name, sender_email, category, user_message):
    """
    Dispatches support query ticket directly to support email via SMTP
    """
    receiver = os.getenv("SMTP_SENDER_EMAIL", "tubabintenaushad@gmail.com")
    app_password = os.getenv("SMTP_APP_PASSWORD", "jlgo kkjo jsii wudg")

    subject = f"Investify Support Ticket: {category} from {name}"
    body = (
        f"Subject: {subject}\n\n"
        f"New Support Ticket Submission on Investify Platform!\n\n"
        f"User Name: {name}\n"
        f"User Email: {sender_email}\n"
        f"Category: {category}\n\n"
        f"User Query Message:\n"
        f"--------------------------------------------------\n"
        f"{user_message}\n"
        f"--------------------------------------------------\n\n"
        f"Investify Support System"
    )

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(receiver, app_password)
        server.sendmail(receiver, receiver, body.encode('utf-8'))
        print("✅ Support query email sent to Gmail successfully!")
        return True
    except Exception as e:
        print("⚠️ Support query email dispatch error:", e)
        return False
    finally:
        try:
            server.quit()
        except Exception:
            pass
