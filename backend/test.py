# import requests
# from bs4 import BeautifulSoup

# def fetch_ixn_symbols():
#     url = "https://stockanalysis.com/etf/ixn/holdings/"
#     res = requests.get(url)
#     soup = BeautifulSoup(res.text, "html.parser")
    
#     symbols = []
#     rows = soup.select("tbody tr")
#     for row in rows:
#         # First cell is rank, second is symbol+name
#         cols = row.find_all("td")
#         if len(cols) >= 2:
#             symbol = cols[1].get_text(strip=True).split()[0]
#             symbols.append(symbol)
#     return symbols

# ixn_symbols = fetch_ixn_symbols()
# print(f"Fetched {len(ixn_symbols)} symbols:")
# print(ixn_symbols)

import yfinance as yf
import pandas as pd

ticker = yf.Ticker("NVDA")

# Financial statements
fs = ticker.financials       # Income statement
bs = ticker.balance_sheet    # Balance sheet

# Get the latest reporting date (column name)
latest_date = fs.columns[0]   # first column is the most recent
latest_date_str = latest_date.strftime("%d-%m-%y")  # format to dd-mm-yy

# Extract values
revenue = fs.loc["Total Revenue"].iloc[0]
net_income = fs.loc["Net Income"].iloc[0]
total_assets = bs.loc["Total Assets"].iloc[0]
total_liabilities = bs.loc["Total Liabilities Net Minority Interest"].iloc[0]
profit = net_income / revenue
net_worth = total_assets - total_liabilities  # equity

# Print
print("Date:", latest_date_str)
print("Revenue:", revenue)
print("Net Income:", net_income)
print("Total Assets:", total_assets)
print("Total Liabilities:", total_liabilities)
print("Profit Margin:", profit)
print("Net Worth (Equity):", net_worth)
