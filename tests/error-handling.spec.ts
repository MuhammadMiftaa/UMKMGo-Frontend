import { test, expect } from "@playwright/test";

test.describe("Error Handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("superadmin@umkm.go.id");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
  });

  test("should handle 404 for invalid application ID", async ({ page }) => {
    await page.goto("/application/999999");
    // Should show error or redirect
  });

  test("should handle 404 for invalid program ID", async ({ page }) => {
    await page.goto("/programs/training/999999");
    // Should show error or redirect
  });

  test("should handle network errors gracefully", async ({ page }) => {
    await page.route("**/api/**", (route) => route.abort());
    await page.goto("/");
    // Application should still be usable
  });
});
