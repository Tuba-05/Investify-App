# In this program, setting task schedulation to fetch daily news fetch and saving to news.json file
# also fetching historic data

from app import app, db, Company, FinancialStatement
import requests, json, yfinance as yf, pandas as pd, numpy as np # yf for fetching financial data, pd for json to dataframe, np for numeric operations
import logging
import datetime, os, sys

# ========================================================================================================================
# This line ensures your console supports UTF-8 (especially in PowerShell or VSCode Terminal)
sys.stdout.reconfigure(encoding='utf-8') 
sys.stderr.reconfigure(encoding='utf-8')
# =========================================================================================================================
# Logging configuration
logger = logging.getLogger() # root logger
logger.setLevel(logging.INFO) # Set default logging level

# File handler
file_handler = logging.FileHandler("updates.log", encoding='utf-8')
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))

# Console handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))

# Avoid duplicate handlers if re-run
if not logger.handlers:
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

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
        
        logging.info(f"✅Total articles fetched: {len(articles)}\n")

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
        logging.info("✅FILE : updates.py : Daily news saved successfully")

    else:
        logging.error(f"❌Error: {response.status_code}, {response.text}"  )
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
            logging.info(f"✅FILE : updates.py : {symbol} last 30 days data saved successfully")
    except Exception as e:
        logging.error(f"❌Error: {e}")
    


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
            logging.info(f"✅FILE : updates.py : {symbol} last 20 years saved successfully")
    except Exception as e:
        logging.error(f"❌Error: {e}")
# ==========================================================================================================================
# **************************************************************************************************************************
# ==========================================================================================================================        
def safe_float(value):
    """Safely convert numeric-like values to float, skip invalid ones."""
    if isinstance(value, (int, float, np.integer, np.floating)):
        return float(value)
    return 0.0


# ==========================================================================================================================
# **************************************************************************************************************************
# ==========================================================================================================================  
def update_companies_details():
    """Function to update companies details in the Companies & Financial Statements DBs."""
    with app.app_context():
        """Update company price/marketcap and financial metrics from yfinance.
            Only updates existing companies (no new records created)."""
        try:
            data_frame = pd.read_json("C:\\Users\\AA\\OneDrive\\Desktop\\Investify\\backend\\companies.json")
            Symbols = data_frame['Symbol']
            # companies = Company.query.all()
            for symbol in Symbols:
                company = Company.query.filter_by(symbol=symbol).first()
                if company:
                    # ===== COMPANIES TABLE UPDATION =====
                    yf_ticker = yf.Ticker(symbol) # fetch data from yfinance 
                    # *** try block isliye use kiya bcz fethcing k time kuch companies k liye key value error araha
                    # tha jis ki waja se function exception block me jaakr end hoja raha tha or aage wali companies 
                    # ka  data updata ni kr raha tha ***
                    try: # fetch fast_info safely
                        info = getattr(yf_ticker, "fast_info", {}) or {}
                    except Exception as e:
                        logging.warning(f"⚠️ fast_info failed for {symbol}: {e}")
                        info = {}

                    # Skip symbols that raise errors due to missing trading data
                    try:
                        test_data = yf_ticker.history(period="1d")
                    except Exception as e:
                        logging.error(f"⚠️ {symbol}: could not fetch data ({e}), skipping this ticker.")
                        continue    

                    # Use .get() to avoid KeyError for missing fields
                    price_usd = info.get("currentPrice") or info.get("last_price") 
                    market_cap = info.get("market_cap") or info.get("marketCap")

                    # Fallback safely
                    if price_usd is None or market_cap is None:
                        try:
                            fallback_info = getattr(yf_ticker, "info", {}) or {}
                            price_usd = price_usd or fallback_info.get("currentPrice")
                            market_cap = market_cap or fallback_info.get("marketCap")
                        except Exception as e:
                            logging.warning(f"⚠️ fallback info failed for {symbol}: {e}")
                            price_usd = None
                            market_cap = None

                    # only update if values are not None
                    if price_usd is not None: 
                        company.price_usd = safe_float(price_usd)
                    if market_cap is not None:    
                        company.marketcap = safe_float(market_cap)  

                    # ===== FINANCIAL STATEMENTS TABLE UPDATION =====
                    c_id =company.id # get company id from Company table
                    fin_stmt = FinancialStatement.query.filter_by(company_id=c_id).first()
                    fs = yf_ticker.financials
                    bs = yf_ticker.balance_sheet
                    if (fs.empty or None)or (bs.empty or None): 
                        logging.warning(f"❌No financial data for {symbol}, skipping update.")
                        continue # skip if no financial data
                    try:    
                        latest_date = fs.columns[0]
                        latest_date_str = latest_date.date() if hasattr(latest_date, 'date') else pd.to_datetime(latest_date).date() # convert to date object

                        # Extract financial metrics
                        revenue_ = fs.loc["Total Revenue", latest_date] if "Total Revenue" in fs.index else None
                        net_income = fs.loc["Net Income", latest_date] if "Net Income" in fs.index else None
                        total_assets = bs.loc["Total Assets", latest_date] if "Total Assets" in bs.index else None
                        total_liabilities = bs.loc["Total Liabilities Net Minority Interest", latest_date] if "Total Liabilities Net Minority Interest" in bs.index else None
                        
                        # Skip update if all are missing
                        if any(pd.isna(v) for v in [revenue_, net_income, total_assets, total_liabilities]):
                            logging.warning(f"❌Incomplete data for {symbol}, skipping FS update.")
                            continue

                        # Calculate derived metrics if financial metrics exist
                        profit_ = net_income / revenue_ if revenue_ != 0 else 0
                        net_worth = total_assets - total_liabilities

                        if fin_stmt:
                            # updating Financial Statements table values only if new data is not None
                            # *** yahan pr "or" use ni kiya b/c zero values ko bhi update krna hai DB mein ***
                            fin_stmt.date = latest_date_str  if latest_date_str is not None else fin_stmt.date
                            fin_stmt.revenue = safe_float(revenue_) if revenue_ is not None else fin_stmt.revenue 
                            fin_stmt.profit = safe_float(profit_) if profit_ is not None else fin_stmt.profit
                            fin_stmt.income = safe_float(net_income)  if net_income is not None else  fin_stmt.income
                            fin_stmt.equity = safe_float(net_worth)  if net_worth is not None else fin_stmt.equity
                            fin_stmt.assets = safe_float(total_assets) if total_assets is not None else fin_stmt.assets
                            fin_stmt.liabilities = safe_float(total_liabilities) if total_liabilities is not None else fin_stmt.liabilities
    
                    except Exception as e:
                        logging.error(f"❌ Error updating FS for {symbol}: {e}")
                        continue
                    logging.info(f"✅Successfully fetched & added data in both DBs for {symbol}") # log success message
                    db.session.commit()
    
                else: logging.warning(f"❌Company {symbol} not found in Company DB — skipping.") # skip if company not found

            logging.info("✅FILE : updates.py : Companies details updated successfully in both DBs") # log success message
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"❌Error reading companies.json:{e}")
            return


# ==========================================================================================================================
# **************************************************************************************************************************
# ==========================================================================================================================  
# def should_run_today(log_file="last_run.txt"):
#     """Check if update already ran today."""
#     today = datetime.date.today().isoformat()
#     if os.path.exists(log_file):
#         with open(log_file, "r") as f:
#             last_run = f.read().strip()
#         if last_run == today:
#             return False  # already ran today
#     with open(log_file, "w") as f:
#         f.write(today)
#     return True

# if should_run_today():
#     logging.info("🔄 Running daily update...")
#     update_companies_details()
#     start_scheduler()
#     logging.info("✅ Update completed successfully.")
# else:
#     logging.info("⏭️ Update already ran today — skipping.")


update_companies_details()
    

