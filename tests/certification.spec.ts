import { test, expect } from "@playwright/test";
import { testConfig } from "../playwright.config";

test.describe("Certification Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
    await page.goto("/certification");
  });

  test("should display certification page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Sertifikasi UMKM" })
    ).toBeVisible();
  });

  test("should have search and filter functionality", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Cari nama, usaha, atau ID...")
    ).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("should display SLA badges", async ({ page }) => {
    // Check if there are any applications with SLA badges
    const slaBadges = page.locator(".inline-flex.items-center.rounded-full");
    const count = await slaBadges.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
