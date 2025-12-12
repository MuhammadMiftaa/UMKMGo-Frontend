import { test, expect } from "@playwright/test";

test.describe("Programs Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("superadmin@umkm.go.id");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("/");
  });

  test.describe("Training Programs", () => {
    test("should display training programs list", async ({ page }) => {
      await page.goto("/programs/training");
      await expect(
        page.getByRole("heading", { name: "Program Pelatihan" })
      ).toBeVisible();
    });

    test("should have search and filter", async ({ page }) => {
      await page.goto("/programs/training");
      await expect(page.getByPlaceholder("Cari program...")).toBeVisible();
    });

    test("should navigate to create program", async ({ page }) => {
      await page.goto("/programs/training");
      await page.getByRole("button", { name: "Buat Program" }).click();
      await expect(page).toHaveURL(/\/programs\/training\/create/);
    });
  });

  test.describe("Certification Programs", () => {
    test("should display certification programs list", async ({ page }) => {
      await page.goto("/programs/certification");
      await expect(
        page.getByRole("heading", { name: "Program Sertifikasi" })
      ).toBeVisible();
    });
  });

  test.describe("Funding Programs", () => {
    test("should display funding programs list", async ({ page }) => {
      await page.goto("/programs/funding");
      await expect(
        page.getByRole("heading", { name: "Program Pendanaan" })
      ).toBeVisible();
    });
  });

  test.describe("Create Program", () => {
    test("should display create program form", async ({ page }) => {
      await page.goto("/programs/training/create?type=training");
      await expect(
        page.getByRole("heading", { name: /Buat Program/i })
      ).toBeVisible();
      await expect(page.getByLabel("Judul Program *")).toBeVisible();
      await expect(page.getByLabel("Penyedia *")).toBeVisible();
      await expect(page.getByLabel("Deskripsi *")).toBeVisible();
    });

    test("should validate required fields", async ({ page }) => {
      await page.goto("/programs/training/create?type=training");
      await page.getByRole("button", { name: "Buat Program" }).click();
    });
  });

  test.describe("Program Detail", () => {
    test("should display program details", async ({ page }) => {
      await page.goto("/programs/training/1");
      await expect(page.getByText("Detail Program")).toBeVisible();
    });

    test("should have edit and delete buttons", async ({ page }) => {
      await page.goto("/programs/training/1");
      await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Hapus" })).toBeVisible();
    });
  });
});
