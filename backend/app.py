from flask import Flask  # to create flask web app
from flask_sqlalchemy import SQLAlchemy  # to make Flask talk to database using Python code instead of SQL
from sqlalchemy import text  #used in line49 unless db connection failed
# for fetching external data (1.e frontend, APIs) & send proper JSON responses to frontend 
# if json (flask will return it in plain string format), if jsonify (frameworks [like React] expect proper JSON headers)
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash # to protect passwords (py library builtin in flask)
from flask_cors import CORS # in order to resolve different server ports(frontend&backend) connection problems 
import requests, base64 # to fetch company logos from Clearbit API & convert to base64 string



app = Flask(__name__)  # createing flask web application

CORS(app, origins=["http://localhost:5173",  "http://localhost:3000"]) # frontend server 


# ============================ Database Configuration ================================================================
DB_URI = f"postgresql://postgres.ltjvcxpuxcrnoomavhre:tubanaushad@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI  # Assign the database URI to Flask's configuration
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable unnecessary tracking to save memory

db = SQLAlchemy(app)  # db obj connected to flask app via SQL Alchemy


# ==================== MODELS (blueprints of tables) =======================
class User(db.Model):
    __tablename__ = 'users'   # table name in database
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())

class Company(db.Model):
    __tablename__ = 'companies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    sector = db.Column(db.String(100))
    country = db.Column(db.String(50), nullable=True)
    symbol = db.Column(db.String(20), nullable=True, unique = True)
    price_usd = db.Column("price(USD)", db.Float, nullable=True)
    marketcap = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.now())

class FinancialStatement(db.Model):
    __tablename__ = 'financial_statement'
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    revenue = db.Column(db.Numeric)
    profit = db.Column(db.Numeric)
    income = db.Column(db.Numeric)
    equity = db.Column(db.Numeric)
    assets = db.Column(db.Numeric)
    liabilities = db.Column(db.Numeric)
    date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=db.func.now())

class Watchlist(db.Model):
    __tablename__ = 'watchlist'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    created_at = db.Column(db.DateTime, default=db.func.now())

with app.app_context(): 
    '''tells Flask "I want to use app features in this standalone script" and gives you access to 
                database operations and other Flask functionality.'''
    pass
    # rows = Company.query.limit(50).all()   # fetch all rows from "users" table
    # data = [ (row.id, row.name, row.symbol, row.country, row.price_usd, row.marketcap, row.sector ) for row in rows]
    # df = pd.DataFrame(data, columns=["id", "c_name", "symbol", "country", "price in USD", "market capitalaization", "sector"])
    # print(tabulate(df, headers="keys", tablefmt="psql")) # data in pretty table format

# =============================== AUTH ROUTES ====================================================

# ================== SIGNUP ROUTE ==================
@app.route("/signup", methods=["POST"])
def signup():
    ''' User signup route '''

    # Get the data (JSON) sent from frontend (username, email, password)
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first(): # check if user exists in DB
        return jsonify({"success": False, "message": "Email already exists"}), 400
    
    hashed_pw = generate_password_hash(password) # Hash the password for security before saving to DB
    new_user = User(name=username, email=email, password=hashed_pw) # creating new user obj
    db.session.add(new_user) # add in DB
    db.session.commit() # save in DB
    print("New user created") # add for checking purposes

    return jsonify({"success": True, "message": "Signup successful!",
                    "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email}
                    }) # Send signup success response to frontend


# ================== LOGIN ROUTE ==================
@app.route("/login", methods=["POST"]) 
def login():
    ''' User login route '''
    
    # Get the data (JSON) sent from frontend (username, email, password)
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = User.query.filter_by(email=email).first() # Find user by email in DB
    
    if not user:    # if user not exists in DB
        return jsonify({"success": False, "message": "User not found"}), 404 

    if not check_password_hash(user.password, password):   # if password not matches with DB passowrd
        return jsonify({"success": False, "message": "Invalid password"}), 401

    print("User logged in") # add for checking purposes
    return jsonify({"success": True, "message": "Login successful!",
                    "user": {"id": user.id, "name": user.name, "email": user.email}
                    }) # Send login success response to frontend


# ================== COMPANIES ROUTE ==================
@app.route("/companies", methods=["GET"])
def stocklist():
    ''' Fetch all companies route '''
    
    rows = Company.query.all()   # fetch all rows from "company" table
    # convert to list of dicts
    data = [
            {
                "id": row.id,
                "c_name": row.name,
                "symbol": row.symbol,
                "country": row.country,
                "price_usd": row.price_usd,
                "market_cap": row.marketcap,
                "sector": row.sector,
            }
    for row in rows ]
    # for checking purposes
    try: 
        if data: 
            print("Successfully fetched companies data from DB(companies)")
            return jsonify(data)
    except Exception as e: print("Error fetching companies data from DB:", e)


# ================== COMPANY DETAILS ROUTE ==================
@app.route('/company/<int:id>', methods=['GET'])
def get_company_details(id):
    ''' Fetch company details along with its logo & financial statements '''
    
    company = db.session.get(Company, id) # get company by ID
    
    if not company: # if company not found in DB
        return jsonify({"success": False, "message": "Company not found"}), 404

    financials = FinancialStatement.query.filter_by(company_id=id).all()  # Fetch financial statements related to the company
    # Convert financial statements to list of dicts
    financial_data = [
        {
            "revenue": fs.revenue,
            "profit": fs.profit,
            "income": fs.income,
            "equity": fs.equity,
            "assets": fs.assets,
            "liabilities": fs.liabilities,
            "date": fs.date.isoformat(),
        }
        for fs in financials
    ]

    # Getting company logo using Clearbit API (free for non-commercial use)
    url = f"https://logo.clearbit.com/{company.name.lower()}.com" 
    try: # fetch logo image from Clearbit
        resp = requests.get(url, stream=True)
        # if logo found
        if resp.status_code == 200: logo_base64 = base64.b64encode(resp.content).decode("utf-8")
        # if logo not found (404)
        else: logo_base64 = None
    except Exception: logo_base64 = None  # if any error occurs (like network issues, invalid URL)

    # Combine company and financial data
    company_data = {
        "id": company.id,
        "logo": logo_base64, # company logo in base64 format
        "c_name": company.name,
        "symbol": company.symbol,
        "country": company.country,
        "price_usd": company.price_usd,
        "market_cap": company.marketcap,
        "sector": company.sector,
        "financials": financial_data,
    }
    # for checking purposes
    try:
      if company_data:
          print("Successfully fetched company details from DB(FinancialStatement)")
          return jsonify(company_data)
    except Exception as e: print("Error fetching company details from DB:", e)


# ================== WATCH-LIST ROUTES ==================
# 1. ************* Get watchlist for a user *************
@app.route('/watchlist/<int:user_id>', methods=['GET'])
def get_watchlist(user_id):
    ''' Fetch a user's watchlist with user and company details '''
    
    try:
        # Fetch user
        user = db.session.query(User).filter_by(id=user_id).first()
        if not user: # if user not found in DB
            return jsonify({"success": False, "message": "User not found"}), 404

        # Fetch companies in user's watchlist
        companies = (
            db.session.query(Company.id, Company.name)
            .join(Watchlist, Watchlist.company_id == Company.id)
            .filter(Watchlist.user_id == user_id)
            .all()
        )

        if not companies: # if watchlist is empty
            return jsonify({ "success": True, "username": user.name, "companies": [] }) 
        
        company_list = [{"id": c[0], "c_name": c[1]} for c in companies] # convert to list of dicts 
        print("Successfully fetched watchlist data from DB") # for checking purposes
        return jsonify({ "success": True, "username": user.name, "companies": company_list})

    except Exception as e:
        print("Error fetching watchlist:", str(e))
        return jsonify({"success": False, "message": "Error fetching watchlist"}), 500


# 2. *************** Add/ Remove company from user's watchlist ***************
@app.route('/watchlist/<int:user_id>/<int:company_id>', methods=['POST'])
def toggle_watchlist(user_id, company_id):
    """ Toggle company in user's watchlist (add/remove) """

    existing_entry = Watchlist.query.filter_by(user_id=user_id, company_id=company_id).first() # check if entry already exists

    if existing_entry:
        # Remove from watchlist
        db.session.delete(existing_entry) # delete entry from DB
        db.session.commit() # save in DB
        print("Company removed from watchlist") # for checking purposes
        return jsonify({"success": True, "action": "removed", "message": "Company removed from watchlist"})

    else:
        # Add to watchlist
        new_entry = Watchlist(user_id=user_id, company_id=company_id) # create new watchlist entry
        db.session.add(new_entry) # add in DB
        db.session.commit() # save in DB
        print("Company added to watchlist") # for checking purposes 
        return jsonify({"success": True, "action": "added", "message": "Company added to watchlist"})


# ================== HOME ROUTE ==================
@app.route("/")
def home():
    ''' Home route to check if backend is running '''
    return {"status": "ok", "message": "Investify backend is running!"}

# ================== Run the Flask app ===================
if __name__ == "__main__":
    ''' Run the Flask app '''
    app.run(debug=True)
