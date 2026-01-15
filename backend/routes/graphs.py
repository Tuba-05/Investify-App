from flask import Blueprint, jsonify
from models.models import Company
import json

graph_bp = Blueprint("graph", __name__)

# ======================== GRAPH ROUTE =============================
# *************** 1- Historical Data (last 30 days) ***************
@graph_bp.route('/historical-data-last-thirtyDAYS/<symbol>', methods=['GET'])
def get_historical_data_last_thirtyDAYS(symbol):
    """ Fetch historical stock data for the last 30 days for a given company symbol """
    # if symbol exits in DB
    company = Company.query.filter_by(symbol=symbol).first()
    if not company: # if company not found in DB    
        return jsonify({"success": False, "message": "Company not found"}), 404
    # updates.get_last30days_data(symbol) # fetch latest data from Alpha Vantage API
    with open("last30days_historical_data.json", "r", encoding="utf-8") as f: # read from last30days_historical_data.json file
        last30days_data = json.load(f) # load JSON data Convert to Python-readable object
    time_series = last30days_data.get("Time Series (5min)", {}) # Extract time series data else return {} dict
    formatted_data = [
            {
                "date": date,
                "open": float(values["1. open"]),
                "high": float(values["2. high"]),
                "low": float(values["3. low"]),
                "close": float(values["4. close"]),
                "volume": int(values["5. volume"])
            }
            for date, values in time_series.items() # .items() gives (key, value) pairs from dict
    ]  
     # Sort by date ascending (for plotting) as data in latest to oldest
    formatted_data.sort(key=lambda x: x["date"])      
    print("Successfully fetched last 30 days historical data") # for checking purposes
    return jsonify({"success": True, "hist_data": formatted_data})
    

# *************** 2- Historical Data (last 20 yrs weekly data) ***************
@graph_bp.route('/historical-data-last-twentyYRS/<symbol>', methods=['GET'])
def get_historical_data_last_twentyYRS(symbol):
    """ Fetch historical stock data for the last 20 years for a given company symbol """
    # if symbol exits in DB
    company = Company.query.filter_by(symbol=symbol).first()
    if not company: # if company not found in DB    
        return jsonify({"success": False, "message": "Company not found"}), 404
    # updates.get_last20yrs_data(symbol) # fetch latest data from Alpha Vantage API
    with open("last20yrs_historical_data.json", "r", encoding="utf-8") as f: # read from last20yrs_historical_data.json file
        last20yrs_data = json.load(f) # load JSON data Convert to Python-readable object
    
    time_series = last20yrs_data.get("Time Series (5min)", {}) # Extract time series data else return {} dict
    formatted_data = [
            {
                "date": date,
                "open": float(values["1. open"]),
                "high": float(values["2. high"]),
                "low": float(values["3. low"]),
                "close": float(values["4. close"]),
                "volume": int(values["5. volume"])
            }
            for date, values in time_series.items() # .items() gives (key, value) pairs from dict
    ]
    # Sort by date ascending (for plotting) as data in latest to oldest
    formatted_data.sort(key=lambda x: x["date"])

    print("Successfully fetched last 20 years historical data") # for checking purposes
    return jsonify({"success": True, "hist_data": formatted_data})



