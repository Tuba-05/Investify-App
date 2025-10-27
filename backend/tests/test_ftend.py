from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def test_login_ui():
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173/login")

    time.sleep(2)
    driver.find_element(By.NAME, "email").send_keys("fmfmfmr@example.com")
    driver.find_element(By.NAME, "password").send_keys("fmjazz")
    driver.find_element(By.TAG_NAME, "button").click()

    time.sleep(3)
    assert "dashboard" in driver.current_url.lower()
    print("✅ Login page works correctly!")
    driver.quit()
