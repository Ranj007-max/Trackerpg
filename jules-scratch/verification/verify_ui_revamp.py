import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.goto("http://localhost:5173")

        # Wait for the page to load
        await expect(page.get_by_role("heading", name="TrackerPG")).to_be_visible()

        # Add a subject to ensure the dashboard is not empty
        await page.get_by_role("button", name="Manager").click()
        await page.get_by_role("button", name="Add Subject").click()
        await page.get_by_role("button", name="Add Subject").click()
        await page.get_by_role("button", name="Dashboard").click()

        # Take a screenshot of the dashboard in light mode
        await page.screenshot(path="jules-scratch/verification/dashboard-light.png")

        # Switch to the manager view
        await page.get_by_role("button", name="Manager").click()
        await expect(page.get_by_role("heading", name="Syllabus Manager")).to_be_visible()

        # Take a screenshot of the subject manager in light mode
        await page.screenshot(path="jules-scratch/verification/manager-light.png")

        # Switch to dark theme
        await page.get_by_title("Toggle Theme").click()
        await page.wait_for_timeout(500) # Wait for theme to apply

        # Take a screenshot of the dashboard in dark mode
        await page.get_by_role("button", name="Dashboard").click()
        await expect(page.get_by_role("heading", name="Preparation Dashboard")).to_be_visible()
        await page.screenshot(path="jules-scratch/verification/dashboard-dark.png")

        # Take a screenshot of the subject manager in dark mode
        await page.get_by_role("button", name="Manager").click()
        await expect(page.get_by_role("heading", name="Syllabus Manager")).to_be_visible()
        await page.screenshot(path="jules-scratch/verification/manager-dark.png")

        await browser.close()

asyncio.run(main())
