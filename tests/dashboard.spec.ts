import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test.beforeEach(async ({ page }) => {
    // Login dulu
    await page.goto("/login");
    await page.getByLabel("Email").fill("superadmin@umkm.go.id");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
  });

  test("should display dashboard statistics cards", async ({ page }) => {
    await expect(page.getByText("Total Pengajuan")).toBeVisible();
    await expect(page.getByText("Dalam Proses")).toBeVisible();
    await expect(page.getByText("Disetujui")).toBeVisible();
    await expect(page.getByText("Ditolak", { exact: true })).toBeVisible();
  });

  test("should display charts", async ({ page }) => {
    await expect(page.getByText("Distribusi Status")).toBeVisible();
    await expect(page.getByText("Jenis Pengajuan")).toBeVisible();
    await expect(page.getByText("Distribusi Jenis Kartu")).toBeVisible();
  });

  test("should display recent applications", async ({ page }) => {
    await expect(page.getByText("Pengajuan Terbaru")).toBeVisible();
  });

//   TODO: FIXED
//   test("should navigate to application detail when clicked", async ({
//     page,
//   }) => {
//     const firstApplication = page.locator(".border.rounded-lg").first();
//     if (await firstApplication.isVisible()) {
//       await firstApplication.click();
//       await expect(page).toHaveURL(/\/application\/\d+/);
//     }
//   });
});
