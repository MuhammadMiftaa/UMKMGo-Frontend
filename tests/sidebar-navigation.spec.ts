import { test, expect } from "@playwright/test";

test.describe("Sidebar Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("superadmin@umkm.go.id");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
  });

  test("should display sidebar menu items", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Program", { exact: true })).toBeVisible();
    await expect(page.getByText("Artikel")).toBeVisible();
    await expect(page.getByRole("link", { name: "Pengaturan" })).toBeVisible();
  });

  test("should navigate to dashboard", async ({ page }) => {
    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL("/");
  });

  test("should navigate to training", async ({ page }) => {
    await page.getByRole("link", { name: "Pelatihan" }).first().click();
    await expect(page).toHaveURL("/training");
  });

  test("should navigate to certification", async ({ page }) => {
    await page.getByRole("link", { name: "Sertifikasi" }).first().click();
    await expect(page).toHaveURL("/certification");
  });

  test("should navigate to funding", async ({ page }) => {
    await page.getByRole("link", { name: "Pendanaan" }).first().click();
    await expect(page).toHaveURL("/funding");
  });

  test("should navigate to settings", async ({ page }) => {
    await page.getByRole("link", { name: "Pengaturan" }).click();
    await expect(page).toHaveURL("/settings");
  });

  test("should logout", async ({ page }) => {
    await page.getByRole("button", { name: "Keluar" }).click();
    await expect(page).toHaveURL("/login");
  });
});
