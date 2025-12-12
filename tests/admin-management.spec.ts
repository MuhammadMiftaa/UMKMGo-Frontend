import { test, expect } from "@playwright/test";
import { testConfig } from "../playwright.config";

test.describe("Admin Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
  });

  test.describe("Add Admin Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/admin/add");
    });

    test("should display add admin form", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Tambah Admin Baru" })
      ).toBeVisible();
      await expect(page.getByLabel("Nama Lengkap *")).toBeVisible();
      await expect(page.getByLabel("Email *")).toBeVisible();
      await expect(
        page.getByLabel("Password *", { exact: true })
      ).toBeVisible();
      await expect(
        page.getByLabel("Konfirmasi Password *", { exact: true })
      ).toBeVisible();
    });

    test("should validate required fields", async ({ page }) => {
      await page.getByRole("button", { name: "Tambah Admin" }).click();
      await expect(page).toHaveURL("/admin/add");
    });

    test("should validate password match", async ({ page }) => {
      await page.getByLabel("Nama Lengkap *").fill("Test Admin");
      await page.getByLabel("Email *").fill("test@admin.com");
      await page.getByLabel("Password *", { exact: true }).fill("password123");
      await page
        .getByLabel("Konfirmasi Password *", { exact: true })
        .fill("password456");
      await page.getByRole("button", { name: "Tambah Admin" }).click();
    });
  });

  test.describe("Admin List Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/admin/list");
    });

    test("should display admin list", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Daftar Admin" })
      ).toBeVisible();
    });

    test("should have search functionality", async ({ page }) => {
      await expect(
        page.getByPlaceholder("Cari nama atau email...")
      ).toBeVisible();
    });

    test("should filter by status", async ({ page }) => {
      const statusSelect = page.locator("select");
      await statusSelect.selectOption("active");
    });
  });

  test.describe("Admin Permissions Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/admin/permissions");
    });

    test("should display permissions page", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Atur Hak Akses" })
      ).toBeVisible();
    });

    test("should display role selection", async ({ page }) => {
      await expect(page.getByText("Pilih Role", { exact: true })).toBeVisible();
    });
  });
});
