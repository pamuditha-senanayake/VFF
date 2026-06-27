import random
from playwright.sync_api import sync_playwright

def run_e2e_test():
    email = f"e2e_test_{random.randint(1000, 9999)}@vff.org"
    password = "SecurePassword123!"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        print("Navigating to register page...")
        page.goto("http://localhost:3000/register")
        try:
            page.wait_for_selector("#visual-pane", timeout=5000)
        except Exception as e:
            with open("e2e_register_dump.html", "w") as f:
                f.write(page.content())
            print("Register page timed out. Saved HTML dump to e2e_register_dump.html")
            raise e
        
        # 1. Assert Style & Split Screen specs on Register Page
        body_bg = page.evaluate("window.getComputedStyle(document.body).backgroundColor")
        print(f"Body background check: {body_bg}")
        assert "rgb" in body_bg or "lab" in body_bg
        
        # Verify presence of left-pane layout for split screen
        left_pane = page.locator("#visual-pane").first
        assert left_pane.count() > 0
        
        button = page.locator("button[type='submit']").first
        btn_bg = button.evaluate("el => window.getComputedStyle(el).backgroundColor")
        btn_font = button.evaluate("el => window.getComputedStyle(el).fontSize")
        print(f"Button background check: {btn_bg}, fontSize: {btn_font}")
        assert btn_bg == "rgb(99, 102, 241)"
        assert btn_font == "15px"

        # 2. Complete register flow
        page.fill("input[id='email']", email)
        page.fill("input[id='password']", password)
        page.fill("input[id='confirm-password']", password)
        
        print("Submitting registration...")
        page.click("button[type='submit']")
        
        page.wait_for_url("**/login", timeout=5000)
        print("Registration successful! Redirected to login page.")
        
        # 3. Assert style specs on Login Page
        body_bg_login = page.evaluate("window.getComputedStyle(document.body).backgroundColor")
        print(f"Login body background check: {body_bg_login}")
        assert "rgb" in body_bg_login or "lab" in body_bg_login

        # 4. Complete login flow
        page.fill("input[id='email']", email)
        page.fill("input[id='password']", password)
        
        print("Submitting login...")
        page.click("button[type='submit']")
        
        page.wait_for_url("**/dashboard", timeout=5000)
        print("Login successful! Redirected to dashboard.")
        
        browser.close()

if __name__ == "__main__":
    run_e2e_test()
