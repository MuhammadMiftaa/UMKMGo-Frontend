import { test, expect } from "@playwright/test";

test.describe("Performance", () => {
  test("dashboard should load within reasonable time", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("superadmin@umkm.go.id");
    await page.getByLabel("Password").fill("admin123");

    const startTime = Date.now();
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });
});
