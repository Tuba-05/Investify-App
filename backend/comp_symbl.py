import pandas as pd  
import requests
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

import yfinance as yf  # Yahoo Finance API (via yfinance Python library)

df = pd.read_json("C:\\Users\\AA\\OneDrive\\Desktop\\Investify\\backend\\companies.json") # redaing json file
symbols = df["Symbol"] # access colum

# Lists to store results
descriptions = []
short_descriptions = []

for symbol in df["Symbol"]:  # Loop through each symbol
    try:
        stock = yf.Ticker(symbol)
        description = stock.info.get("longBusinessSummary", "Description not available")
    except Exception as e:
        description = f"Error fetching data: {e}"
    descriptions.append(description)  # Append full description

    # Append short description (max 1500 chars)
    if description != "Description not available":
        short_descriptions.append(description[:1500] + "...")
    else:
        print("Description not available")

# Add new columns to DataFrame
# df["description"] = descriptions
df["description"] = short_descriptions

df.to_json("C:\\Users\\AA\\OneDrive\\Desktop\\Investify\\backend\\companies.json", indent=4) # Save back to JSON file

# print(stock.info["longBusinessSummary"]) # Company description


