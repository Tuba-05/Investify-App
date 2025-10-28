from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
options = Options()
options.add_argument("--start-maximized")  # optional

driver = webdriver.Chrome(options=options)  # no need for chromedriver.exe path

def test_login_ui():
    try:    
        driver.get("http://localhost:5173/")
        driver.maximize_window()
        time.sleep(2)
        driver.find_element(By.NAME, "email").send_keys("fmfmfm@example.com")
        driver.find_element(By.NAME, "password").send_keys("fmjazz")
        # driver.find_element(By.TAG_NAME, "button[type='submit']").click()
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        time.sleep(3)
        page_source = driver.page_source

        if "Welcome Back" in page_source:
            print("✅ Sign-Up test passed! User registered successfully.")
        else:
            print("❌ Sign-Up test failed. Message not found on page.")

    except Exception as e:
        print(f"⚠️ Error during test: {e}")

    finally:
        print(driver.current_url)
        time.sleep(2)
        driver.quit()

test_login_ui()