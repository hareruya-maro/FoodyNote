from playwright.sync_api import Page, expect, sync_playwright
import time

def test_doctor_screen(page: Page):
    print("Navigating to test page...")
    # 1. Arrange: Go to the test doctor screen.
    page.goto("http://localhost:8081/test_doctor")

    # Wait for the page to load - check for report title "Foody Note Report" or translated "Foody Note レポート"
    # Initial state is English probably (mock data doesn't dictate initial language, i18n does)
    # Default fallback is 'en'
    try:
        page.wait_for_selector('text=Foody Note', timeout=10000)
    except:
        print("Timeout waiting for 'Foody Note'. Taking screenshot.")
        page.screenshot(path="/home/jules/verification/timeout.png")
        raise

    print("Page loaded. Switching to Japanese...")
    # 2. Switch to Japanese
    # React Native Button maps to role="button" or similar.
    # Button title="Japanese"
    page.get_by_text("Japanese").click()

    # Wait a bit for translation to apply
    time.sleep(2)

    print("Verifying content...")
    # 3. Verify content
    # Check for "1月31日" (part of the date format)
    # Since formatted date is "1月31日 11:30", get_by_text("1月31日", exact=False) should work
    expect(page.get_by_text("1月31日")).to_be_visible()

    # Check for translated symptom
    expect(page.get_by_text("痛み")).to_be_visible()
    expect(page.get_by_text("重度")).to_be_visible()

    # Check for "その他" which we added
    expect(page.get_by_text("その他")).to_be_visible()

    # 4. Screenshot
    print("Taking screenshot...")
    page.screenshot(path="/home/jules/verification/doctor_screen_ja.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_doctor_screen(page)
            print("Test passed!")
        except Exception as e:
            print(f"Error: {e}")
            raise e
        finally:
            browser.close()
