import { test, expect, Page, Browser, Locator } from "@playwright/test";
import { setupBrowser, teardownBrowser } from "./hooks";
import { checkLogoExists, selectOptions } from "./common-function";
import locators from "./locators-main";
import routes from "./routes";

test.describe("Test suite for e2e TB", () => {
  let browser: Browser;
  let page: Page;

  // Load browser and setup state before each test.
  test.beforeEach(async () => {
    const result = await setupBrowser();
    browser = result.browser;
    page = result.page;
    await page.goto(routes.mainUrl);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/TireBuyer/);
    await expect(page).toHaveURL(/.*tire/);
    await page.addStyleTag({
      content: "#attentive_creative { display: none }",
    });
  });

  // Shut down the browser after each test, so that each test can be standalone.
  test.afterEach(async () => {
    await teardownBrowser(browser);
  });

  test('"Get started" link Tirebuyer', async () => {
    const shoppingCartElement = await page.$(locators.shoppingCart);
    const isShoppingCartVisible = await shoppingCartElement?.isVisible();
    // Expects the URL to contain tire.
    // Expect element to be visible
    expect(isShoppingCartVisible).toBe(true);
  });

  test("Check Tirebuyer logo", async () => {
    await checkLogoExists(page);
  });

  test("[COMPONENT] - Checks the homepage hero Banner and finance sections", async () => {
    await expect(page.locator('div[class="homeHero"]')).toBeVisible();
    await expect(
      page.locator('div[class*="Fitment_financeEasySection"]')
    ).toBeVisible();
  });

  test("[E2E] - Submit request form for tyres", async () => {
    // Interact with the page
    await page.getByText("Vehicle make & model").click();
    //function for selecting the options
    await selectOptions(page, 'div[id="fitmentPanelData"]', [
      "2023",
      "BMW",
      "M3",
      "Competition",
      "275/40R18 103Y",
    ]);
    //Insert zipcode
    await page.fill('input[id="zipCode"]', "22333");
    //Search for results
    await page.click('span[class*="MobileFitment_shopTireBtnText"]');
    //Verify search results page is shown
    const selector = 'span[class="plp-product-count-bold"]';
    await page.waitForSelector(selector);
    const textContent = await page.$eval(selector, (el) => el.textContent);
    //Assert that number of results text is shown!
    expect(textContent).toMatch(/\d+ \bresults\b/);
  });

  test("[E2E] - Submit tire size request", async () => {
    // Interact with the page
    await page.getByText("Tire size", { exact: true }).click();
    const fitmentPanelData = 'div[id*="fitmentPanelData"]';
    await selectOptions(page, fitmentPanelData, ["105", "70", "14"]);
    //Insert zipcode
    await page.fill('input[id="zipCode"]', "22333");
    //Search for results
    await page.click('span[class*="MobileFitment_shopTireBtnText"]');
    //Verify search results page is shown
    const selector = 'span[class="plp-product-count-bold"]';
    await page.waitForSelector(selector);
    const textContent = await page.$eval(selector, (el) => el.textContent);
    //Assert that number of results text is shown!
    expect(textContent).toMatch(/\d+ \bresults\b/);
  });
});
