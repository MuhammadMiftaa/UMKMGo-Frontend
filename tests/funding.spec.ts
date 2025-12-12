import { test, expect } from "@playwright/test";

test.describe("Funding Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("superadmin@umkm.go.id");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
    await page.goto("/funding");
  });

  test("should display funding page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Pendanaan UMKM" })
    ).toBeVisible();
  });

  test("should have search and filter functionality", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Cari nama, usaha, atau ID...")
    ).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
  });
});
