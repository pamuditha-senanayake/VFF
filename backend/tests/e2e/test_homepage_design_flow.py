from playwright.sync_api import sync_playwright

def run_homepage_design_e2e():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        # 1. Start at Homepage
        print("Navigating to homepage...")
        page.goto("http://localhost:3000/")
        assert page.locator("text=VFF").first.is_visible()
        assert page.locator("h1:has-text('Empower welfare')").is_visible()
        
        # Verify stats bar metrics
        assert page.locator("text=CORE SYSTEM MODULES").first.is_visible()
        assert page.locator("text=FORENSIC AUDIT").first.is_visible()
        
        # Verify Visual Captions
        assert page.locator("text=VFF VETERINARY CLINIC CARE CENTER").is_visible()
        
        # Verify About Us and Accomplishments Sections
        assert page.locator("text=About Vets For Future").is_visible()
        assert page.locator("text=What We Have Accomplished").is_visible()
        assert page.locator("text=15,000+ Treated").is_visible()
        
        # Verify Contact Section
        assert page.locator("text=Colombo Operational HQ").first.is_visible()
        assert page.locator("text=ops@vetsforfuture.org").first.is_visible()
        
        # Verify Values Grid
        page.locator("h3:has-text('TRANSPARENCY')").wait_for(state="visible", timeout=5000)
        assert page.locator("h3:has-text('TRANSPARENCY')").is_visible()
        assert page.locator("h3:has-text('MERITOCRACY')").is_visible()
        assert page.locator("h3:has-text('ACCESSIBILITY')").is_visible()

        # 2. Click Start challenge button
        print("Clicking Start challenge button...")
        page.click("text=Access System")
        page.wait_for_url("**/register", timeout=5000)
        assert page.locator("text=Create an account").is_visible()
        
        # 3. Click Back to website link
        print("Clicking Back to website button...")
        page.click("text=Back to website")
        page.wait_for_url("**/", timeout=5000)
        assert page.locator("text=Empower welfare").is_visible()

        # 4. Click Discover platform button
        print("Clicking Discover platform button...")
        page.click("text=Documentation")
        page.wait_for_url("**/login", timeout=5000)
        assert page.locator("h2:has-text('Authorize access')").is_visible()

        # 5. Click Back to website link
        print("Clicking Back to website button...")
        page.click("text=Back to website")
        page.wait_for_url("**/", timeout=5000)
        assert page.locator("text=Empower welfare").is_visible()

        print("Homepage E2E VFF flows verified successfully.")
        browser.close()

if __name__ == "__main__":
    run_homepage_design_e2e()
