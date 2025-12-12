import { test, expect } from "@playwright/test";

test.describe("Protected Routes", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("should redirect to login for training page", async ({ page }) => {
    await page.goto("/training");
    await expect(page).toHaveURL("/login");
  });

  test("should redirect to login for certification page", async ({ page }) => {
    await page.goto("/certification");
    await expect(page).toHaveURL("/login");
  });

  test("should redirect to login for funding page", async ({ page }) => {
    await page.goto("/funding");
    await expect(page).toHaveURL("/login");
  });

  test("should redirect to login for settings page", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL("/login");
  });
});
