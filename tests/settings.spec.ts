import { test, expect } from "@playwright/test";
import { testConfig } from "../playwright.config";

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
    await page.goto("/settings");
  });

  test("should display settings page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Pengaturan" })
    ).toBeVisible();
  });

  test("should display user management section", async ({ page }) => {
    await expect(page.getByText("Manajemen Pengguna")).toBeVisible();
  });

  test("should display profile settings section", async ({ page }) => {
    await expect(page.getByText("Profil Pengguna")).toBeVisible();
  });

  test("should display SLA configuration section", async ({ page }) => {
    await expect(page.getByText("Konfigurasi SLA")).toBeVisible();
  });

  test("should update profile", async ({ page }) => {
    // Now label is properly connected with input using htmlFor and id
    await page.getByLabel("Nama").fill("Updated Name");
    await page.getByRole("button", { name: "Update Profil" }).click();
  });

  test("should navigate to add admin page", async ({ page }) => {
    // Use getByRole('link') instead of 'button' since it's a Link component
    await page.getByRole("link", { name: "Tambah Admin Baru" }).click();
    await expect(page).toHaveURL("/admin/add");
  });

  test("should navigate to admin list page", async ({ page }) => {
    // Use getByRole('link') instead of 'button' since it's a Link component
    await page.getByRole("link", { name: "Lihat Daftar Admin" }).click();
    await expect(page).toHaveURL("/admin/list");
  });

  test("should navigate to permissions page", async ({ page }) => {
    // Use getByRole('link') instead of 'button' since it's a Link component
    await page.getByRole("link", { name: "Atur Hak Akses" }).click();
    await expect(page).toHaveURL("/admin/permissions");
  });
});
