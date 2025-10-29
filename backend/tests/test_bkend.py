import requests # for interacting with web APIs.

# api endpoints testing
BASE_URL = "http://127.0.0.1:5000"

# 1.flask backend api testing
def test_fask_app():
    response = requests.get(f"{BASE_URL}")
    assert response.status_code == 200
    print(f"✅ flask backend api is running.")


# 2. login/ signup api testing
def test_user_info():
    login_data = {
        "email" : 'fmfmfm@gmail.com',
        "password" : 'fmjazz'
    }
    signup_data = {
        "name" : 'jazz',
        "email" : 'fmfmfm@gmail.com',
        "password" : 'fmjazz'
    }
    response1 = requests.post(f"{BASE_URL}/login", json=login_data)
    response2 = requests.post(f"{BASE_URL}/signup", json=signup_data)
    try:
        if response1.status_code == 200:
            print("✅ login route working")
    except Exception as e:
        print(str(e))
    try:            
        if response2.status_code == 201:
            print("✅ [NEW USER] sign up route working")
        if response2.status_code == 400:
            print("✅ [USER ALREADY EXISTS] sign up route working")    
    except Exception as e:
        print(str(e))

# 3.companies api testing 
def test_company_api():
    response = requests.get(f"{BASE_URL}/companies")  # example company ID
    assert response.status_code == 200
    data = response.json()
    # If it's a list, take the first element
    if isinstance(data, list):
        assert len(data) > 0, "Empty list returned from /company/1"
        data = data[0]  # extract the first dictionary

    assert "c_name" in data, f"'c_name' not found. Actual keys: {list(data.keys())}"
    print(f"✅ Tocklist route working")

def test_company_detail_api():
    response =requests.get(f"{BASE_URL}/company/5")
    data = response.json()
    if response.status_code == 200:
        print(f"{data['c_name']} has id of number of 5")    
        print(f"✅ Company Details route working")    


# 4.watchlist api testing
def test_watchlist_api():
    user_id = 2
    response =requests.get(f"{BASE_URL}/watchlist/{user_id}")
    w_data = response.json()
    if response.status_code == 200:
        print(f"{w_data['username']} , {w_data['companies']}")
        print(f"✅ WatchList route working")
    else: print("Something Wrong")

def test_news_fetch_api():
    response = requests.get(f"{BASE_URL}/fetch-daily-news")
    daily_news = response.json()
    if response.status_code == 200 and daily_news.get("success"):
        articles = daily_news.get("articles", [])
        print(f"✅ Daily NEWS route working")
        print(f"Total {len(articles)} articles fetched")
    else: print(f"❌ Failed to fetch news. Status code: {response.status_code}")


test_fask_app()
test_user_info()
test_company_api()
test_company_detail_api()
test_watchlist_api()
test_news_fetch_api()