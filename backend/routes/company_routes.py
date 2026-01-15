from flask import Blueprint, jsonify
from database.database import db
from models.models import Company, FinancialStatement
import requests, base64

company_bp = Blueprint("company", __name__)


# ================== COMPANIES ROUTES ==================
# ********* 1- STOCKLIST TABLE *********
@company_bp.route("/companies", methods=["GET"])
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


# ********* 2- FINANCIAL STATEMENT/ DETAILS *********
@company_bp.route('/company/<int:id>', methods=['GET'])
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

