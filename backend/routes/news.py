from flask import Blueprint, jsonify
import json

news_bp = Blueprint("news", __name__)

# ======================= 6. DAILY NEWS ROUTE =======================
@news_bp.route("/fetch-daily-news", methods=["GET"])    
def fetch_news_from_file():
    """ Function to read news from news.json file and return as JSON response """
    try:
        with open("json/files/news.json", "r", encoding="utf-8") as f: # read from news.json file
            news_data = json.load(f) # load JSON data Convert to Python-readable object 
        print("Successfully fetched daily news from news.json file") # for checking purposes
        return jsonify({"success": True, "articles": news_data})
    except Exception as e:
        print("Error reading news file:", str(e))
        return jsonify({"success": False, "message": "Error reading news file"}), 500        

