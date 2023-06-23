// hooks.ts
import { chromium, Browser, Page } from "@playwright/test";

export async function setupBrowser(): Promise<{
  browser: Browser;
  page: Page;
}> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  return { browser, page };
}

export async function teardownBrowser(browser: Browser): Promise<void> {
  await browser.close();
}
