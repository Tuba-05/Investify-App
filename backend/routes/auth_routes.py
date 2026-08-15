from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database.database import db
from models.models import User, ForgotPassword
from threading import Thread
import ottp.ottp as ottp

auth_bp = Blueprint("auth", __name__)

# =============================== AUTH ROUTES ====================================================

# ================== 1. SIGNUP ROUTE ==================
@auth_bp.route("/signup", methods=["POST"])
def signup():
    ''' User signup route '''

    # Get the data (JSON) sent from frontend (username, email, password)
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first(): # check if user exists in DB
        print("User already exists")
        return jsonify({"success": False, "message": "Email already exists"}), 400
    
    hashed_pw = generate_password_hash(password) # Hash the password for security before saving to DB
    new_user = User(name=username, email=email, password=hashed_pw) # creating new user obj
    db.session.add(new_user) # add in DB
    db.session.commit() # save in DB
    print("New user created") # add for checking purposes

    return jsonify({"success": True, "message": "Signup successful!",
                    "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email}
                    }) # Send signup success response to frontend


# ================== 2. LOGIN ROUTE ==================
@auth_bp.route("/login", methods=["POST"]) 
def login():
    ''' User login route '''
    
    # Get the data (JSON) sent from frontend (username, email, password)
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    change_password = data.get("ChangePassword")
    user = User.query.filter_by(email=email).first() # Find user by email in DB
    
    if not user:    # if user not exists in DB
        return jsonify({"success": False, "message": "User not found"}), 404 
    
    if not check_password_hash(user.password, password):   # if password not matches with DB passowrd
        return jsonify({"success": False, "message": "Invalid password"}), 401
    
    if change_password:
        if user.password == password: 
            return jsonify({"success": False, "message": "New password can not be Old password" })
        else:
            User.query.filter_by(email=email).update({"password": generate_password_hash(password)})
            db.session.commit()
            print("User logged in with new password.")
            return jsonify({"success": True, "message": "Login successful with new password!",
                        "user": {"id": user.id, "name": user.name, "email": user.email}
                        }), 200
    
    print("User logged in") # add for checking purposes
    return jsonify({"success": True, "message": "Login successful!",
                    "user": {"id": user.id, "name": user.name, "email": user.email}
                    }), 200 # Send login success response to frontend


# ================== 3. FORGOT PASSWORD ROUTE ==================
# ********* 1- CODE GENERATION *********
@auth_bp.route("/veri-code-fpassword", methods=["POST"])
def forgot_pass():
    """ when login user forgot password """
    data = request.get_json()
    email = data.get("email")
    user = User.query.filter_by(email = email).first() # Find user by email in DB
    if not user:
        print("user not found") 
        return jsonify({"success": False , "message": "no such email exist" }), 404
    # keep generating new code whenever finds a duplicate in DB 
    while True:
        veri_code = ottp.generate_random_password()
        if not ForgotPassword.query.filter_by(verif_code = veri_code).first():  break

    send_mail = Thread(target=ottp.send_mail, args=(veri_code, email)).start()
    # Suppose user already exists
    previous_entry = ForgotPassword.query.filter_by(email=email).order_by(ForgotPassword.id.desc()).first()
    current_count = previous_entry.no_of_codes_generated if previous_entry else 0
    new_count = current_count + 1
    from datetime import datetime, timedelta
    expired_time = datetime.utcnow() + timedelta(minutes=2)
    f_pass_entry = ForgotPassword(user_id= user.id, email= email, verif_code= veri_code, expired_at=expired_time, no_of_codes_generated= new_count)
    db.session.add(f_pass_entry)
    db.session.commit()
    print(" Saved in forgot_pass_details DB successfully ")
    return jsonify({"success": True, "message" : "Code sent to email & successfully added in DB" })

# ********* 2- CODE VERIFICATION *********
@auth_bp.route("/check-veri-code", methods=['POST'])
def check_veri_code():
    data = request.get_json()
    email = data.get("email")
    code = data.get("veriCode")
    previous_entry = ForgotPassword.query.filter_by(email=email).order_by(ForgotPassword.id.desc()).first()
    if previous_entry.verif_code == code: 
        print(" Code verified ")
        return jsonify({"success": True, "message" : "Code Verified : )" })
    else: 
        print(" Code not verified. ")
        return jsonify({"success" : False, "message" : "Wrong Verification code : ("})


# ********* 3- SUBMIT SUPPORT TICKET (DISPATCH GMAIL EMAIL VIA SMTP) *********
@auth_bp.route("/submit-support-ticket", methods=["POST"])
def submit_support_ticket():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    category = data.get("category", "General Query")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"success": False, "message": "Name, email, and message are required."}), 400

    # Dispatch email in background thread so API responds instantly
    Thread(target=ottp.send_support_query, args=(name, email, category, message)).start()

    return jsonify({"success": True, "message": "Support query ticket sent to Gmail successfully!"})

