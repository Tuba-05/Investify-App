# In this program, setting task schedulation to fetch daily news fetch and saving to news.json file
# also fetching historic data

from app import db, Companies, FinancialStatement, app
import requests
import json

# ===========================================================================================================================
# Daily News Fetch and Save to news.json file
def start_scheduler():
    # API endpoint and parameters
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "language": "en",
        "category": "business",
        "apiKey": "9718ed53731a41f1a8c08d42844fe6e8"
    }

    # Send GET request
    response = requests.get(url, params=params) 

    # Check if successful
    if response.status_code == 200:
        data = response.json()
        articles = data.get("articles", []) # Safely get articles list
        
        print(f"Total articles fetched: {len(articles)}\n")

        filtered_articles = []
        for article in articles:
            filtered_articles.append({ 
                "source": article["source"]["name"] if article["source"] else "Unknown", 
                "author": article.get("author", "Unknown"), 
                "title": article.get("title", "No title"), 
                "description": article.get("description", "No description"),
                "url": article.get("url", "No URL")
            })

        with open("news.json", "w", encoding="utf-8") as f: # Save to news.json file
            json.dump(filtered_articles, f, indent=4, ensure_ascii=False)
        print("FILE : updates.py : Daily news saved successfully")

    else:
        print("Error:", response.status_code, response.text)
# ==========================================================================================================================
# **************************************************************************************************************************
# ==========================================================================================================================
# Historical Data Fetch and Save to last30days_historical_data.json & last20yrs_historical_data.json files
def get_last30days_data(symbol):
    """Fetches and saves the last 30 days of intraday stock data for the given symbol."""
    Symbol = symbol
    url_1 = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={Symbol}&interval=60min&outputsize=full&apikey=YAB8GYYHAUBZZDZW"
    response = requests.get(url_1)

    try:
        if response.status_code == 200:
            data = response.json()
            with open("last30days_historical_data.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print(f"FILE : updates.py : {symbol} last 30 days data saved successfully")
    except Exception as e:
        print("Error:", str(e))
    


def get_last20yrs_data(symbol):
    """Fetches and saves the last 20 years of weekly stock data for the given symbol."""
    Symbol = symbol
    url_2 = f"https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol={Symbol}&apikey=YAB8GYYHAUBZZDZW"
    response = requests.get(url_2)

    try:
        if response.status_code == 200:
            data = response.json()
            with open("last20yrs_historical_data.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print(f"FILE : updates.py : {symbol} last 20 years saved successfully")
    except Exception as e:
        print("Error:", str(e))
# ==========================================================================================================================
# **************************************************************************************************************************
# ==========================================================================================================================        

with app.app_context():
    # your DB update logic here
    pass
