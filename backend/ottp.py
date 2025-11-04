import random
import string
import datetime
import smtplib

def generate_random_password(length=6):
    """
    Generates a random password of a specified length.
    By default, it generates a 6-character password.
    """
     # Only allow these punctuation marks instead of all
    allowed_punctuations = "!@#*%$"
    # Combine lowercase, uppercase letters, digits, and punctuation for a strong password
    characters = string.ascii_letters + string.digits + allowed_punctuations
    
    # Use random.SystemRandom() for cryptographically secure randomness
    # This is preferred over random.choice for security-sensitive applications
    secure_random = random.SystemRandom()
    
    password = ''.join(secure_random.choice(characters) for _ in range(length)) # list ko string me convert k liye join use kiya 
    return password


def send_mail(password):
    sender = "tubabintenaushad@gmail.com"
    app_password = "jlgo kkjo jsii wudg"
    receiver = "tubabintenaushad@gmail.com"

    message = f"Subject:Forgot password Verification Code\n\nThis is your verification code for Investify App login {password}" \
    "\n NOTE: this code will be active for 2 minutes."

    try:
        # connect to Gmail's SMTP server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()  # secure the connection
        server.login(sender, app_password)
        server.sendmail(sender, receiver, message)
        print("✅ Email sent successfully!")
    except Exception as e:
        print("⚠️ Error:", e)
    finally:
        server.quit()

# Step 2: Store code with timestamp
def create_code_entry():
    code = 'abc34we'
    expiry_time = datetime.datetime.now() + datetime.timedelta(minutes=2)
    return {"code": code, "expires_at": expiry_time}

# Step 3: Check if code is still valid
def verify_code(user_input, code_entry):
    current_time = datetime.datetime.now()
    if current_time > code_entry["expires_at"]:
        return "❌ Code expired!"
    elif user_input == code_entry["code"]:
        return "✅ Code verified successfully!"
    else:
        return "⚠️ Invalid code."

    

