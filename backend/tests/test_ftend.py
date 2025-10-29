from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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
        driver.find_element(By.CLASS_NAME, "auth-form") # div tag of className="auth-form"
        # elements in login form pg
        driver.find_element(By.NAME, "email").send_keys("fmfmfm@gmail.com")
        driver.find_element(By.NAME, "password").send_keys("fmjazz")
        time.sleep(2)
        
        h1_text = driver.find_element(By.CLASS_NAME, "auth-title").text
        if "Welcome Back" in h1_text:
            print("✅ Login screen displayed correctly.")
            driver.find_element(By.CSS_SELECTOR, "button[type='button']").click()
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            print("ℹ️ Alert Text:", alert.text) 
            alert.accept()
        else:
            print("❌ Text mismatch on login screen.")

    except Exception as e:
        print(f"⚠️ Error during test: {e}") 

    finally:
        print(driver.current_url)
        time.sleep(1)
        driver.quit()

def test_signup_ui():
    try:    
        driver.get("http://localhost:5173/")
        driver.maximize_window()
        driver.find_element(By.CLASS_NAME, "auth-switch") # div tag
        driver.find_element(By.CLASS_NAME, "switch-button").click() 
        time.sleep(5)
        driver.find_element(By.CLASS_NAME, "auth-form") # div tag of className="auth-form"
        # elements in signup form pg
        driver.find_element(By.NAME, "username"). send_keys("jazz")
        driver.find_element(By.NAME, "email").send_keys("fmfmfm@gmail.com")
        driver.find_element(By.NAME, "password").send_keys("fmjazz")
        time.sleep(2)
        
        h1_text = driver.find_element(By.CLASS_NAME, "auth-title").text
        if "Create Account" in h1_text:
            print("✅ sign up screen displayed correctly.")
            driver.find_element(By.CSS_SELECTOR, ".glass-button.primary").click()
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            print("ℹ️ Alert Text:", alert.text)
            alert.accept()
        else:
            print("❌ Text mismatch on signup screen.")

    except Exception as e:
        print(f"⚠️ Error during test: {e}")

    finally:
        print(driver.current_url)
        time.sleep(1)
        driver.quit()

test_login_ui()
test_signup_ui()