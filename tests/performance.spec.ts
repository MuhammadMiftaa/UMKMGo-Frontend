import { test, expect } from "@playwright/test";
import { testConfig } from "../playwright.config";

test.describe("Performance", () => {
  test("dashboard should load within reasonable time", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);

    const startTime = Date.now();
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });
});
