import requests
import json


def get_last30days_data():
    """Fetches and saves the last 30 days of intraday stock data for the given symbol."""
    Symbol = 'AAPL'
    url_1 = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={Symbol}&interval=60min&outputsize=full&apikey=YAB8GYYHAUBZZDZW"
    response = requests.get(url_1)

    try:
        if response.status_code == 200:
            data = response.json()
            with open("last30days_historical_data.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print("saved successfully")
    except Exception as e:
        print("Error:", str(e))
    


def get_last20yrs_data():
    """Fetches and saves the last 20 years of weekly stock data for the given symbol."""
    Symbol = 'AAPL'
    url_2 = f"https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol={Symbol}&apikey=YAB8GYYHAUBZZDZW"
    response = requests.get(url_2)

    try:
        if response.status_code == 200:
            data = response.json()
            with open("last20yrs_historical_data.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print("saved successfully")
    except Exception as e:
        print("Error:", str(e))


get_last20yrs_data()
get_last30days_data()        