// common-function.ts
import { Locator, Page } from "@playwright/test";
import locators from "./locators-main";

export const checkLogoExists = async (page: Page): Promise<boolean> => {
  const logo = await page.$(locators.logo);
  return logo !== null;
};

export const selectOptions = async (
  page: Page,
  selector: string | Locator,
  optionsToSelect: string[]
) => {
  // loop over the options you want to select
  for (const option of optionsToSelect) {
    // build the selector for the specific option
    const optionSelector = `${selector} :text("${option}")`;
    // wait for the option to be visible and then click it
    const element = await page.waitForSelector(optionSelector, {
      state: "visible",
    });
    await element.click();
  }
};
