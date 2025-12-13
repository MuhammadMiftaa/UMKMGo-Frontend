import { test, expect } from "@playwright/test";
import { testConfig } from "../playwright.config";

test.describe("Application Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
  });

  test("should display back button", async ({ page }) => {
    await page.goto("/application/1");
    await expect(page.getByRole("button", { name: /Kembali/i })).toBeVisible();
  });

  test("should display applicant information", async ({ page }) => {
    await page.goto("/application/1");
    await expect(page.getByText("Informasi Pemohon")).toBeVisible();
  });

  test("should display application details", async ({ page }) => {
    await page.goto("/application/1");
    await expect(page.getByTestId("application-detail-title")).toBeVisible();
  });

  test("should display documents", async ({ page }) => {
    await page.goto("/application/1");
    await expect(page.getByText("Berkas Pengajuan")).toBeVisible();
  });

  test("should display status history", async ({ page }) => {
    await page.goto("/application/1");
    await expect(page.getByText("Riwayat Status")).toBeVisible();
  });

  test("should navigate back when back button clicked", async ({ page }) => {
    await page.goto("/application/1");
    await page.getByRole("button", { name: /Kembali/i }).click();
    await page.waitForURL("/");
  });
});
