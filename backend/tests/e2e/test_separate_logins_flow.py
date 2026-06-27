import random
from playwright.sync_api import sync_playwright

def run_separate_logins_e2e():
    email = f"user_e2e_{random.randint(1000, 9999)}@vff.org"
    admin_email = f"admin_e2e_{random.randint(1000, 9999)}@vff.org"
    password = "SecurePassword123!"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start at User Login page
        print("Navigating to user login page...")
        page.goto("http://localhost:3000/login")
        assert page.locator("text=Admin Portal").is_visible()
        
        # 2. Click Admin Portal link
        print("Clicking Admin Portal link...")
        page.click("text=Admin Portal")
        page.wait_for_url("**/login/admin", timeout=5000)
        assert page.locator("text=Admin portal access").is_visible()
        
        # Verify no registration link is displayed on Admin login
        assert page.locator("text=Register here").count() == 0

        # 3. Perform standard user registration
        print("Navigating to register page...")
        page.goto("http://localhost:3000/register")
        page.fill("input[id='email']", email)
        page.fill("input[id='password']", password)
        page.fill("input[id='confirm-password']", password)
        page.click("button[type='submit']")
        
        page.wait_for_url("**/login", timeout=5000)
        print("User registered successfully and redirected to login.")

        # 4. Perform admin registration on secret page
        print("Navigating to secret admin register page...")
        page.goto("http://localhost:3000/register/admin")
        assert page.locator("text=Create an administrator account").is_visible()
        
        page.fill("input[id='email']", admin_email)
        page.fill("input[id='password']", password)
        page.fill("input[id='confirm-password']", password)
        page.click("button[type='submit']")
        
        page.wait_for_url("**/login", timeout=5000)
        print("Admin registered successfully and redirected to login.")
        
        browser.close()

if __name__ == "__main__":
    run_separate_logins_e2e()
