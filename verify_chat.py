from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to home page...")
        page.goto("http://localhost:5173")

        # Wait for the home page to load
        page.wait_for_selector("text=How can I help you?", timeout=10000)
        print("Home page loaded.")

        # Click the Chat Mode button
        print("Clicking 'Chat Mode' button...")
        # targeting the link with title "Chat Mode"
        page.click("a[title='Chat Mode']")

        print("Waiting for chat greeting...")
        greeting_text = "Hello! I'm your AI assistant. I can help you open websites, search the web, send messages, and more. What would you like to do?"
        try:
            page.wait_for_selector(f"text={greeting_text}", timeout=10000)
            print("Chat greeting found.")
        except Exception as e:
            print("Chat greeting NOT found.")
            page.screenshot(path="verification/error_chat_greeting.png")
            raise e

        # Test API Integration
        print("Testing API integration...")

        # Type in the input
        # Note: Chat.jsx uses TextInput which has an input with placeholder "Type a message..."
        page.fill("input[placeholder='Type a message...']", "Open google.com")

        # Press Enter
        page.press("input[placeholder='Type a message...']", "Enter")

        # Wait for backend response
        expected_response = "Opening the website for you."
        print(f"Waiting for response: '{expected_response}'...")

        try:
            page.wait_for_selector(f"text={expected_response}", timeout=10000)
            print("Backend response received! Integration successful.")
            page.screenshot(path="verification/success_api_response.png")
        except Exception as e:
            print("Backend response NOT received.")
            page.screenshot(path="verification/error_api_response.png")
            print("Screenshot saved to verification/error_api_response.png")
            raise e

        browser.close()

if __name__ == "__main__":
    run()
