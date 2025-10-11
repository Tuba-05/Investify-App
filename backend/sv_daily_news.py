# In this program, setting task schedulation to fetch daily news fetch and saving to news.json file then save to news database

import requests
import json

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
            "author": article.get("author", "N/A"),
            "title": article.get("title", "No title"),
            "description": article.get("description", "No description"),
            "url": article.get("url", "No URL")
        })

    with open("news.json", "w", encoding="utf-8") as f: # Save to news.json file
        json.dump(filtered_articles, f, indent=4, ensure_ascii=False)
    print("saved successfully")

else:
    print("Error:", response.status_code, response.text)
