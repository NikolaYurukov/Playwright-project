import { test, expect, Page, Browser, ElementHandle } from "@playwright/test";
import { setupBrowser, teardownBrowser } from "./hooks";
import { checkLogoExists, selectOptions } from "./common-function";
import locators from "./locators-main";
import routes from "./routes";

test.describe("Test suite for e2e TB", () => {
  let browser: Browser;
  let page: Page;

  test.beforeEach(async () => {
    const result = await setupBrowser();
    browser = result.browser;
    page = result.page;
    await page.goto(routes.mainUrl);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/TireBuyer/);
    await expect(page).toHaveURL(/.*tire/);
  });

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
    const heroBanner = await page.$('div[class="homeHero"]');
    const financeEasySection = await page.$(
      'div[class*="Fitment_financeHubEasySection"]'
    );
    const isFinanceEasySectionVisible = await financeEasySection?.isVisible();
    const isHeroBannerVisible = await heroBanner?.isVisible();
    expect(isFinanceEasySectionVisible).toBe(true);
    expect(isHeroBannerVisible).toBe(true);
  });

  test("[E2E] - Submit request form for tyres", async () => {
    let makeAndModel: ElementHandle | null;
    // Interact with the page
    makeAndModel = await page.$('div[class*="custTabFitmentItems"]');
    const isMakeModelVisible = await makeAndModel?.isVisible();
    expect(isMakeModelVisible).toBe(true);
    await makeAndModel?.click();
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
    let tireSize = page.locator(
      "#simple-tabpanel-0 .FitmentBlock_custTabFitment__2NyCr > div:nth-child(2)"
    );
    const isTireSizeVisible = await tireSize.isVisible();
    expect(isTireSizeVisible).toBe(true);
    await tireSize.click();
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
