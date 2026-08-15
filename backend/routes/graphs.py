import os
from flask import Blueprint, jsonify
from models.models import Company
import json
import yfinance as yf

graph_bp = Blueprint("graph", __name__)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ======================== GRAPH ROUTE =============================
# *************** 1- Historical Data (last 30 days LIVE yfinance) ***************
@graph_bp.route('/historical-data-last-thirtyDAYS/<symbol>', methods=['GET'])
def get_historical_data_last_thirtyDAYS(symbol):
    """ Fetch live stock historical data for the last 30 days via yfinance """
    company = Company.query.filter_by(symbol=symbol).first()
    if not company:
        return jsonify({"success": False, "message": "Company not found"}), 404

    # 1. Try Live yfinance History (1mo)
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="1mo", interval="1d")

        if not df.empty:
            formatted_data = []
            for date_idx, row in df.iterrows():
                date_str = date_idx.strftime("%Y-%m-%d")
                formatted_data.append({
                    "date": date_str,
                    "open": round(float(row["Open"]), 2),
                    "high": round(float(row["High"]), 2),
                    "low": round(float(row["Low"]), 2),
                    "close": round(float(row["Close"]), 2),
                    "volume": int(row["Volume"])
                })
            
            if formatted_data:
                return jsonify({"success": True, "hist_data": formatted_data})
    except Exception as e:
        print(f"yfinance 30d live fetch warning for {symbol}: {e}")

    # 2. Fallback to local JSON file scaled to company stock price
    json_path = os.path.join(BASE_DIR, "jsonfiles", "last30days_historical_data.json")
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            last30days_data = json.load(f)
        
        time_series = last30days_data.get("Time Series (5min)", {})
        base_price = company.price_usd if company.price_usd and company.price_usd > 0 else 180.0
        scale_factor = base_price / 281.0 if base_price > 0 else 1.0

        formatted_data = [
            {
                "date": date,
                "open": round(float(values.get("1. open", 0)) * scale_factor, 2),
                "high": round(float(values.get("2. high", 0)) * scale_factor, 2),
                "low": round(float(values.get("3. low", 0)) * scale_factor, 2),
                "close": round(float(values.get("4. close", 0)) * scale_factor, 2),
                "volume": int(values.get("5. volume", 100))
            }
            for date, values in time_series.items()
        ]  
        formatted_data.sort(key=lambda x: x["date"])      
        return jsonify({"success": True, "hist_data": formatted_data})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# *************** 2- Historical Data (last 20 yrs weekly data LIVE yfinance) ***************
@graph_bp.route('/historical-data-last-twentyYRS/<symbol>', methods=['GET'])
def get_historical_data_last_twentyYRS(symbol):
    """ Fetch live stock historical data for multi-year trend via yfinance """
    company = Company.query.filter_by(symbol=symbol).first()
    if not company:
        return jsonify({"success": False, "message": "Company not found"}), 404

    # 1. Try Live yfinance History (10y weekly)
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="10y", interval="1wk")

        if not df.empty:
            formatted_data = []
            for date_idx, row in df.iterrows():
                date_str = date_idx.strftime("%Y-%m-%d")
                formatted_data.append({
                    "date": date_str,
                    "open": round(float(row["Open"]), 2),
                    "high": round(float(row["High"]), 2),
                    "low": round(float(row["Low"]), 2),
                    "close": round(float(row["Close"]), 2),
                    "volume": int(row["Volume"])
                })
            
            if formatted_data:
                return jsonify({"success": True, "hist_data": formatted_data})
    except Exception as e:
        print(f"yfinance 10y live fetch warning for {symbol}: {e}")

    # 2. Fallback to local JSON file scaled to company stock price
    json_path = os.path.join(BASE_DIR, "jsonfiles", "last20yrs_historical_data.json")
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            last20yrs_data = json.load(f)
        
        time_series = last20yrs_data.get("Time Series (5min)", {})
        base_price = company.price_usd if company.price_usd and company.price_usd > 0 else 180.0
        scale_factor = base_price / 50.0 if base_price > 0 else 1.0

        formatted_data = [
            {
                "date": date,
                "open": round(float(values.get("1. open", 0)) * scale_factor, 2),
                "high": round(float(values.get("2. high", 0)) * scale_factor, 2),
                "low": round(float(values.get("3. low", 0)) * scale_factor, 2),
                "close": round(float(values.get("4. close", 0)) * scale_factor, 2),
                "volume": int(values.get("5. volume", 100))
            }
            for date, values in time_series.items()
        ]
        formatted_data.sort(key=lambda x: x["date"])

        return jsonify({"success": True, "hist_data": formatted_data})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
