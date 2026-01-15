# import pandas as pd  
# import requests
#-----------------------------------------------------------------------------------------------------------#
# TO EXTRACT SYMBOLS AND COUNTRIES FROM CSV FILE AND SAVE TO JSON  FILE
#-----------------------------------------------------------------------------------------------------------#
# df = pd.read_csv("C:\\Users\\AA\\OneDrive\\Desktop\\Investify\\backend\\CompaniesSymbol.csv") # Read CSV

# data = df[["Rank", "Name", "Symbol", "marketcap","price (USD)","country"]] # Extract specific columns
# data.to_json("companies.json", orient="records", indent=4)  # Save to JSON file , 
# # indent 4 => [ {"Name": "AAPL", "symbol": "AAPL"} ] , orient="records" => human readable format                        

# print("Saved to companies.json")
#-----------------------------------------------------------------------------------------------------------#
#------------------dont need to run the above code again as json file is already created--------------------#
#-----------------------------------------------------------------------------------------------------------#
# df = pd.read_json("C:\\Users\\AA\\OneDrive\\Desktop\\Investify\\backend\\companies.json") # redaing json file
# if not df.empty: # if json has read successfully
#     print("read")

# symbols = df["Symbol"] # access colum
#-----------------------------------------------------------------------------------------------------------#

# url = "https://eodhd.com/api/eod/MCD.US?from=2017-01-05&to=2017-02-10&period=d&api_token=6672e1c60807f9.96044866&fmt=json"

#-----------------------------------------------------------------------------------------------------------#
# TO GET COMPANY DESCRIPTION USING YAHOO FINANCE API
#-----------------------------------------------------------------------------------------------------------#
# import yfinance as yf  # Yahoo Finance API (via yfinance Python library)

# df = pd.read_json("C:\\Users\\AA\\OneDrive\\Desktop\\Investify\\backend\\companies.json") # redaing json file
# symbols = df["Symbol"] # access colum

# # Lists to store results
# descriptions = []
# short_descriptions = []

# for symbol in df["Symbol"]:  # Loop through each symbol
#     try:
#         stock = yf.Ticker(symbol)
#         description = stock.info.get("longBusinessSummary", "Description not available")
#     except Exception as e:
#         description = f"Error fetching data: {e}"
#     descriptions.append(description)  # Append full description

#     # Append short description (max 1500 chars)
#     if description != "Description not available":
#         short_descriptions.append(description[:1500] + "...")
#     else:
#         print("Description not available")

# # Add new columns to DataFrame
# # df["description"] = descriptions
# df["description"] = short_descriptions

# df.to_json("C:\\Users\\AA\\OneDrive\\Desktop\\Investify\\backend\\companies.json", indent=4) # Save back to JSON file

# print(stock.info["longBusinessSummary"]) # Company description


#____________________________________________________________________________________
# FOR companies TABLE(DB)
# try:
        # with open("companies.json", "r", encoding="utf-8") as file:
        #    data = json.load(file)
        # for item in data:
        #     name = item.get("name")
        #     symbol = item.get("symbol") 
        #     marketcap = item.get("marketcap")
        #     country = item.get("country")
        #     symbol = item.get("symbol")
        #     price_usd = item.get("price (USD)")  
            
        #     company = Companies(
        #         name=name,
        #         sector="tech",
        #         country=country,
        #         symbol=symbol,
        #         marketcap = makrketcap,
        #         price=price_usd
        #     )
        #     db.session.add(company)

        #     db.session.commit()
#____________________________________________________________________________________
# FOR financial statement TABLE(DB)
#____________________________________________________________________________________
# import json, yfinance as yf, pandas as pd
# with app.app_context():
#     try:
#         df = pd.read_json("C:\\Users\\AA\\OneDrive\\Desktop\\Investify\\backend\\companies.json")
#         symbols = df["Symbol"]
        
#         for symbol in symbols:
#             try:
#                 # Find the corresponding company
#                 company = Company.query.filter_by(symbol=symbol).first()  
#                 if not company:
#                     print(f"Company with symbol {symbol} not found in companies table")
#                     continue
                
#                 # CHECK IF FINANCIAL STATEMENT ALREADY EXISTS
#                 existing_statement = FinancialStatement.query.filter_by(company_id=company.id).first()
#                 if existing_statement:
#                     print(f"Financial statement for {symbol} already exists, skipping...")
#                     continue  # Skip if already exists
                
#                 ticker = yf.Ticker(symbol)
#                 fs = ticker.financials
#                 bs = ticker.balance_sheet

#                 if fs.empty or bs.empty:
#                     continue

#                 latest_date = fs.columns[0]
#                 latest_date_str = latest_date.date()

#                 # Extract financial metrics
#                 revenue = fs.loc["Total Revenue"].iloc[0]
#                 net_income = fs.loc["Net Income"].iloc[0]
#                 total_assets = bs.loc["Total Assets"].iloc[0]
#                 total_liabilities = bs.loc["Total Liabilities Net Minority Interest"].iloc[0]
                
#                 if pd.isna(revenue) or pd.isna(net_income):
#                     continue
                    
#                 profit = net_income / revenue if revenue != 0 else 0
#                 net_worth = total_assets - total_liabilities

#                 financial_statement = FinancialStatement(
#                     company_id=company.id,      
#                     revenue=float(revenue),            
#                     profit=float(profit),             
#                     income=float(net_income),          
#                     equity=float(net_worth),          
#                     assets=float(total_assets),        
#                     liabilities=float(total_liabilities),  
#                     date=latest_date_str        
#                 )
                
#                 db.session.add(financial_statement)
#                 print(f"Added financial statement for {symbol}")  # Track progress
                
#             except Exception as e:
#                 print(f"Error processing {symbol}: {e}")
#                 continue
        
#         db.session.commit()
#         print("Financial statements successfully added to database")
                      
#     except Exception as e:
#         db.session.rollback()
#         print(f"Database error: {e}")
#
##____________________________________________________________________________________
# TO GET COMPANY LOGO USING CLEARBIT API
#____________________________________________________________________________________
# import requests

# # Example company domain
# domain = "microsoft"
# url = f"https://logo.clearbit.com/{domain}.com"

# # Where to save the logo
# save_path = f"{domain}_logo.png"

# try:
#     response = requests.get(url, stream=True)

#     if response.status_code == 200:
#         with open(save_path, "wb") as f:
#             for chunk in response.iter_content(1024):
#                 f.write(chunk)
#         print(f"✅ Logo downloaded successfully: {save_path}")
#     else:
#         print(f"❌ Failed to fetch logo, status code: {response.status_code}")

# except Exception as e:
#     print("⚠️ Error:", str(e))



# ----------------------------------------------------------------------------------------------------
# TO EXTRACT SYMBOLS AND COUNTRIES FROM CSV/JSON FILE AND SAVE TO NEW JSON  FILE
# ----------------------------------------------------------------------------------------------------
# import csv
# import json
# import pycountry # to convert country names to ISO codes

# # Input and output file paths
# input_file = "C://Users//AA//OneDrive//Desktop//Investify//backend//companies.json"     # can be CSV or JSON
# output_file = "symbols.json"

# results = []

# def get_country_code(country_name):
#     """Convert country name to 2-letter ISO code."""
#     try:
#         country = pycountry.countries.lookup(country_name) # lookup is case-insensitive and handles common names
#         return country.alpha_2   # return 2-letter code
#     except LookupError:
#         return country_name[:2].upper()  # fallback if not found

# # --- Case 1: CSV Input ---
# # if input_file.endswith(".csv"):
# #     with open(input_file, newline="", encoding="utf-8") as csvfile:
# #         reader = csv.DictReader(csvfile)
# #         for row in reader:
# #             symbol = row.get("Symbol")
# #             country = row.get("country")
# #             if symbol and country:
# #                 code = get_country_code(country)
# #                 results.append({
# #                     "symbol": symbol,
# #                     "country": country,
# #                     "symbol_country": f"{symbol}.{code}"
# #                 })

# # --- Case 2: JSON Input ---
# if input_file.endswith(".json"):
#     with open(input_file, "r", encoding="utf-8") as f:
#         data = json.load(f)
#         for row in data:
#             symbol = row.get("Symbol")
#             country = row.get("country")
#             if symbol and country:
#                 code = get_country_code(country)
#                 results.append({
#                     "symbol": symbol,
#                     "country": country,
#                     "symbol_country": f"{symbol}.{code}"
#                 })

# # Save results to new JSON file
# with open(output_file, "w", encoding="utf-8") as f:
#     json.dump(results, f, indent=4)

# print(f"✅ Extracted {len(results)} records and saved to {output_file}")

# ----------------------------------------------------------------------------------------------------
# selectiong first 10 news foound for companies in symbols.json and saving to news.json
# ----------------------------------------------------------------------------------------------------

# import json, time, requests
# from datetime import datetime

# API_TOKEN = "6672e1c60807f9.96044866"
# URL_TMPL = "https://eodhd.com/api/news?s={symbol}&offset={offset}&limit={limit}&api_token={token}&fmt=json"

# INPUT_FILE = "symbols.json"   # contains [{"symbol_country": "AAPL.US"}, ...]
# OUTPUT_FILE = "news.json"
# TARGET_COUNT = 9
# PER_PAGE = 10
# MAX_PAGES_PER_COMPANY = 10
# REQUEST_DELAY = 0.2
# REQUEST_TIMEOUT = 10

# def load_companies(path):
#     with open(path, "r", encoding="utf-8") as f:
#         data = json.load(f)
#     return [c["symbol_country"] for c in data if c.get("symbol_country")]

# def unique_id(item):
#     return item.get("uuid") or item.get("url") or (item.get("title", "") + "|" + str(item.get("published_at", "")))

# def sanitize_item(item, symbol):
#     return {
#         "uuid": item.get("uuid"),
#         "title": item.get("title"),
#         "source": item.get("source"),
#         "url": item.get("url"),
#         "image_url": item.get("image_url"),
#         "published_at": item.get("published_at"),
#         "symbol": symbol
#     }

# def parse_date(date_str):
#     try:
#         return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
#     except Exception:
#         return datetime.min  # fallback if date missing/invalid

# def fetch_page(symbol, offset, limit=PER_PAGE):
#     url = URL_TMPL.format(symbol=symbol, offset=offset, limit=limit, token=API_TOKEN)
#     return requests.get(url, timeout=REQUEST_TIMEOUT)

# def collect_news(target=TARGET_COUNT):
#     company_symbols = load_companies(INPUT_FILE)
#     if not company_symbols:
#         raise RuntimeError("No companies found in input file (symbol_country missing).")

#     all_news = []
#     seen = set()
#     offsets = {sym: 0 for sym in company_symbols}
#     exhausted = set()
#     total_requests = 0
#     max_requests = 2000

#     while len(all_news) < target and len(exhausted) < len(company_symbols) and total_requests < max_requests:
#         made_progress = False
#         for sym in company_symbols:
#             if sym in exhausted:
#                 continue
#             if offsets[sym] // PER_PAGE >= MAX_PAGES_PER_COMPANY:
#                 exhausted.add(sym)
#                 continue

#             try:
#                 resp = fetch_page(sym, offsets[sym], PER_PAGE)
#                 total_requests += 1
#             except Exception as e:
#                 print(f"[WARN] Request failed for {sym}: {e}")
#                 time.sleep(REQUEST_DELAY)
#                 continue

#             if resp.status_code != 200:
#                 print(f"[WARN] {sym} returned HTTP {resp.status_code}")
#                 offsets[sym] += PER_PAGE
#                 time.sleep(REQUEST_DELAY)
#                 continue

#             try:
#                 items = resp.json()
#             except Exception as e:
#                 print(f"[WARN] JSON parse error for {sym}: {e}")
#                 offsets[sym] += PER_PAGE
#                 time.sleep(REQUEST_DELAY)
#                 continue

#             if not items:
#                 exhausted.add(sym)
#                 print(f"[INFO] No news left for {sym}")
#                 continue

#             added = 0
#             for it in items:
#                 uid = unique_id(it)
#                 if not uid or uid in seen:
#                     continue
#                 seen.add(uid)
#                 all_news.append(sanitize_item(it, sym))
#                 added += 1

#             if added:
#                 made_progress = True
#                 print(f"[INFO] Added {added} from {sym} (offset {offsets[sym]}), total={len(all_news)}")
#             offsets[sym] += PER_PAGE
#             time.sleep(REQUEST_DELAY)

#         if not made_progress:
#             break

#     # Sort everything by date (latest first) and trim to target
#     all_news_sorted = sorted(all_news, key=lambda x: parse_date(x["published_at"]), reverse=True)
#     return all_news_sorted[:target]

# def main():
#     news = collect_news(TARGET_COUNT)
#     with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
#         json.dump(news, f, indent=2)
#     print(f"\n✅ Saved {len(news)} most recent news items to {OUTPUT_FILE}")

# if __name__ == "__main__":
#     main()

# ____________________________________________________________________________________

# newsapi.org
# from newsapi import NewsApiClient

# API_KEY = "9718ed53731a41f1a8c08d42844fe6e8"

# # Init
# newsapi = NewsApiClient(api_key=API_KEY)

# # /v2/top-headlines
# top_headlines = newsapi.get_top_headlines(q='bitcoin',
#                 sources='bbc-news,the-verge',
#                 language='en',)
#                 # category='business', # these params cannot be used with sources param
#                 # country='us') 

# # /v2/everything
# all_articles =  newsapi.get_everything(q='bitcoin',
#                 sources='bbc-news,the-verge',
#                 domains='bbc.co.uk,techcrunch.com',
#                 from_param='2025-09-21',
#                 to='2025-08-21',
#                 language='en',
#                 sort_by='relevancy',
#                 page=2)

# # /v2/top-headlines/sources
# sources = newsapi.get_sources()

# # Print results (just titles for readability)
# print("Sources:")
# for src in sources['sources']:
#     print(src['name'])

# print("\nTop Headlines:")
# for article in top_headlines['articles']:
#     # print(article['title'])
#     print(article)

# print("\nAll Articles:")
# for article in all_articles['articles']:
#     print(article['title'])


# ____________________________________________________________________________________
# FETCHING NEWS USING REQUESTS LIBRARY AND SAVING TO news.json

# import requests
# import json

# # API endpoint and parameters
# url = "https://newsapi.org/v2/top-headlines"
# params = {
#     "language": "en",
#     "category": "business",
#     "apiKey": "9718ed53731a41f1a8c08d42844fe6e8"
# }

# # Send GET request
# response = requests.get(url, params=params) 

# # Check if successful
# if response.status_code == 200:
#     data = response.json()
#     articles = data.get("articles", []) # Safely get articles list
    
#     print(f"Total articles fetched: {len(articles)}\n")

#     filtered_articles = []
#     for article in articles:
#         filtered_articles.append({ 
#             "source": article["source"]["name"] if article["source"] else "Unknown", 
#             "author": article.get("author", "N/A"),
#             "title": article.get("title", "No title"),
#             "description": article.get("description", "No description"),
#             "url": article.get("url", "No URL")
#         })

#     with open("news.json", "w", encoding="utf-8") as f:
#         json.dump(filtered_articles, f, indent=4, ensure_ascii=False)
#     print("saved successfully")

# else:
#     print("Error:", response.status_code, response.text)

# ____________________________________________________________________________________
# HISTORICAL DATA USING ALPHAVANTAGE API

import requests
import json

# replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key

demo = "YAB8GYYHAUBZZDZW"  # API KEY
url_1 = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=60min&outputsize=full&apikey=YAB8GYYHAUBZZDZW" #last 30 days intraday data
# url_2 ="https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=AAPL&apikey=YAB8GYYHAUBZZDZW" # last 20 years weekly data
response = requests.get(url_1)

try:
    if response.status_code == 200:
        data = response.json()
        with open("historical_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print("saved successfully")
except Exception as e:
    print("Error:", str(e))