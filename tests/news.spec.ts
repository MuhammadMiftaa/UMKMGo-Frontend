import { test, expect } from "@playwright/test";

test.describe("News Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("superadmin@umkm.go.id");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
  });

  test.describe("News List", () => {
    test("should display news list", async ({ page }) => {
      await page.goto("/news");
      await expect(
        page.getByRole("heading", { name: "Manajemen Berita" })
      ).toBeVisible();
    });

    test("should have create button", async ({ page }) => {
      await page.goto("/news");
      await expect(
        page.getByRole("button", { name: "Buat Berita" })
      ).toBeVisible();
    });

    test("should have search and filters", async ({ page }) => {
      await page.goto("/news");
      await expect(
        page.getByPlaceholder("Cari judul atau isi berita...")
      ).toBeVisible();
    });

    test("should filter by category", async ({ page }) => {
      await page.goto("/news");
      // Click the category filter trigger (Select component)
      await page.locator('[data-testid="category-filter"]').click();
      await page.getByRole("option", { name: "Pengumuman" }).click();
      // Verify filter is applied
      await expect(
        page.locator('[data-testid="category-filter"]')
      ).toContainText("Pengumuman");
    });

    test("should filter by status", async ({ page }) => {
      await page.goto("/news");
      // Click the status filter trigger (Select component)
      await page.locator('[data-testid="status-filter"]').click();
      await page.getByRole("option", { name: "Dipublikasikan" }).click();
      // Verify filter is applied
      await expect(page.locator('[data-testid="status-filter"]')).toContainText(
        "Dipublikasikan"
      );
    });
  });

  test.describe("Create News", () => {
    test("should display create news form", async ({ page }) => {
      await page.goto("/news/create");
      await expect(
        page.getByRole("heading", { name: "Buat Berita" })
      ).toBeVisible();
      await expect(page.getByLabel("Judul Berita *")).toBeVisible();
      // Use test ID for Select component
      await expect(
        page.locator('[data-testid="category-select"]')
      ).toBeVisible();
      await expect(page.getByLabel("Ringkasan *")).toBeVisible();
    });

    test("should validate required fields", async ({ page }) => {
      await page.goto("/news/create");
      await page.getByRole("button", { name: "Buat Berita" }).click();
    });
  });

  test.describe("News Detail", () => {
    test("should display news details", async ({ page }) => {
      await page.goto("/news/1");
      await expect(page.getByText("Detail Berita")).toBeVisible();
    });

    test("should have edit and delete buttons", async ({ page }) => {
      await page.goto("/news/1");
      await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Hapus" })).toBeVisible();
    });
  });
});
