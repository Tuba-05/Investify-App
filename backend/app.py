from flask import Flask  # to create flask web app
from flask_sqlalchemy import SQLAlchemy  # to make Flask talk to database using Python code instead of SQL
from sqlalchemy import text  #used in line49 unless db connection failed
# for fetching external data (1.e frontend, APIs) & send proper JSON responses to frontend 
# if json (flask will return it in plain string format), if jsonify (frameworks (like React) expect proper JSON headers)
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash # to protect passwords (py library builtin in flask)
from flask_cors import CORS # in order to resolve different server ports(frontend&backend) connection problems 
import pandas as pd # for showing DB in better tabular format
from tabulate import tabulate # showing pandas in a table format



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
    # Get the data (JSON) sent from frontend (username, email, password)
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # check if user exists in DB
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already exists"}), 400
    
    # Hash the password for security before saving to DB
    hashed_pw = generate_password_hash(password)
    new_user = User(name=username, email=email, password=hashed_pw) # creating new user obj
    db.session.add(new_user) # add in DB
    db.session.commit() # save in DB
    print("New user created") # add for checking purposes

    return jsonify({"success": True, "message": "Signup successful!"}) # Send signup success response to frontend


# ================== LOGIN ROUTE ==================
@app.route("/login", methods=["POST"]) 
def login():
    # Get the data (JSON) sent from frontend (username, email, password)
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    # Find user by email in DB
    user = User.query.filter_by(email=email).first()
    if not user:    # if user not exists in DB
        return jsonify({"success": False, "message": "User not found"}), 404 

    if not check_password_hash(user.password, password):   # if password not matches with DB passowrd
        return jsonify({"success": False, "message": "Invalid password"}), 401

    print("User logged in") # add for checking purposes
    return jsonify({"success": True, "message": "Login successful!"}) # Send login success response to frontend


# ================== COMPANIES ROUTE ==================
@app.route("/companies", methods=["GET"])
def stocklist():
    rows = Company.query.all()   # fetch all rows from "users" table
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
    company = db.session.get(Company, id) # get company by ID
    if not company: # if company not found in DB
        return jsonify({"success": False, "message": "Company not found"}), 404

    # Fetch financial statements related to the company
    financials = FinancialStatement.query.filter_by(company_id=id).all()
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
    # Combine company and financial data
    company_data = {
        "id": company.id,
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


# ================== HOME ROUTE ==================
@app.route("/")
def home():
    return {"status": "ok", "message": "Investify backend is running!"}

# ================== Run the Flask app ===================
if __name__ == "__main__":
    app.run(debug=True)
