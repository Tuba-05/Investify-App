import os
import json
import requests
import xml.etree.ElementTree as ET
from flask import Blueprint, jsonify

news_bp = Blueprint("news", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(BASE_DIR, "jsonfiles", "news.json")


def fetch_live_tech_finance_news():
    """Fetch live technology and finance news from NewsAPI or Google News RSS"""
    articles = []
    
    # 1. Try NewsAPI Business & Technology
    try:
        api_key = os.getenv("NEWS_API_KEY", "9718ed53731a41f1a8c08d42844fe6e8")
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "category": "business",
            "language": "en",
            "pageSize": 15,
            "apiKey": api_key
        }
        res = requests.get(url, params=params, timeout=4)
        if res.status_code == 200:
            data = res.json()
            raw_articles = data.get("articles", [])
            for item in raw_articles:
                if item.get("title") and item.get("title") != "[Removed]":
                    articles.append({
                        "source": item.get("source", {}).get("name", "Financial News"),
                        "author": item.get("author") or "Finance & Tech Desk",
                        "title": item.get("title"),
                        "description": item.get("description") or item.get("title"),
                        "url": item.get("url", "#")
                    })
    except Exception as e:
        print("NewsAPI live fetch notice:", e)

    # If NewsAPI returned articles, save & return them
    if articles:
        try:
            with open(JSON_PATH, "w", encoding="utf-8") as f:
                json.dump(articles, f, indent=4, ensure_ascii=False)
        except Exception:
            pass
        return articles

    # 2. Fallback to Google News RSS (Finance + Technology)
    try:
        rss_url = "https://news.google.com/rss/search?q=stocks+finance+technology&hl=en-US&gl=US&ceid=US:en"
        rss_res = requests.get(rss_url, timeout=4)
        if rss_res.status_code == 200:
            root = ET.fromstring(rss_res.text)
            for item in root.findall(".//item")[:15]:
                title = item.findtext("title", "Finance Update")
                link = item.findtext("link", "#")
                source = item.findtext("source", "Market News")
                articles.append({
                    "source": source,
                    "author": "Tech & Finance Desk",
                    "title": title,
                    "description": title,
                    "url": link
                })
    except Exception as e:
        print("RSS live fetch notice:", e)

    if articles:
        try:
            with open(JSON_PATH, "w", encoding="utf-8") as f:
                json.dump(articles, f, indent=4, ensure_ascii=False)
        except Exception:
            pass
        return articles

    return None


# ======================= DAILY NEWS ROUTE =======================
@news_bp.route("/fetch-daily-news", methods=["GET"])    
def fetch_news_from_file():
    """ Fetch live Tech & Finance news or fallback to news.json file """
    live_articles = fetch_live_tech_finance_news()
    if live_articles:
        print("Successfully fetched LIVE Tech & Finance news!")
        return jsonify({"success": True, "articles": live_articles})

    # Fallback to news.json if live network call fails
    try:
        if os.path.exists(JSON_PATH):
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                news_data = json.load(f)
            print("Successfully loaded fallback news from news.json file")
            return jsonify({"success": True, "articles": news_data})
    except Exception as e:
        print("Error reading news file:", str(e))

    return jsonify({"success": False, "message": "Error reading news file"}), 500        

