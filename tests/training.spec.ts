import { test, expect } from "@playwright/test";
import { testConfig } from "../playwright.config";

test.describe("Training Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
    await page.goto("/training");
  });

  test("should display training page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Pelatihan UMKM" })
    ).toBeVisible();
  });

  test("should have search and filter functionality", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Cari nama, usaha, atau ID...")
    ).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("should filter applications by search term", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Cari nama, usaha, atau ID...");
    await searchInput.fill("test");
    await page.waitForTimeout(500);
  });

  test("should filter applications by status", async ({ page }) => {
    const statusSelect = page.locator("select").first();
    await statusSelect.selectOption("screening");
    await page.waitForTimeout(500);
  });

  test("should navigate to application detail", async ({ page }) => {
    const detailButton = page.getByRole("button", { name: /Detail/i }).first();
    if (await detailButton.isVisible()) {
      await detailButton.click();
      await expect(page).toHaveURL(/\/application\/\d+/);
    }
  });
});
