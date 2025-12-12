import { test, expect } from "@playwright/test";
import { testConfig } from "../playwright.config"; // UPDATE: import path changed

test.describe("Login Page", () => {
  test.beforeAll(() => {
    // Log config saat test dimulai (hanya di CI)
    if (testConfig.isCI) {
      console.log("🔧 Test Configuration:");
      console.log(`   Environment: ${testConfig.environment}`);
      console.log(`   Base URL: ${testConfig.baseURL}`);
      console.log(`   Email: ${testConfig.credentials.email}`);
      console.log(
        `   Password: ${testConfig.credentials.password ? "***SET***" : "***NOT SET***"}`
      );
    }
  });

  test.beforeEach(async ({ page }) => {
    // baseURL sudah di-set di playwright.config, jadi bisa langsung '/'
    await page.goto("/login");
  });

  test("should display login form elements", async ({ page }) => {
    const logo = page.locator('img[alt="UMKMGo Logo"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/dblibr1t2/image/upload/v1762742634/umkmgo_logo.png"
    );

    await expect(page.getByRole("heading", { name: "UMKMGo" })).toBeVisible();
    await expect(page.getByText("Masuk ke Dashboard Admin")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByPlaceholder("admin@umkm.go.id")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk" })).toBeEnabled();
  });

  test("should have correct input types", async ({ page }) => {
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(emailInput).toHaveAttribute("required", "");
    await expect(passwordInput).toHaveAttribute("required", "");
  });

  test("should not submit form with empty fields", async ({ page }) => {
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show error message for invalid credentials", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("wrong@email.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Masuk" }).click();

    await expect(page.getByText("Email atau password salah")).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show loading state when submitting", async ({ page }) => {
    await page.getByLabel("Email").fill("test@email.com");
    await page.getByLabel("Password").fill("password123");

    const submitButton = page.getByRole("button", { name: "Masuk" });
    await submitButton.click();

    await expect(page.getByRole("button", { name: "Masuk..." })).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    // GUNAKAN credentials dari config (GitLab CI Variables atau default)
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);

    await page.getByRole("button", { name: "Masuk" }).click();

    // Tunggu redirect ke dashboard (baseURL sudah di-set)
    await page.waitForURL("/", {
      timeout: testConfig.timeouts.navigation,
      waitUntil: "networkidle",
    });
    await expect(page).toHaveURL("/");

    // Verify user logged in
    await expect(
      page.getByRole("heading", { name: "Dashboard", exact: true })
    ).toBeVisible();
  });

  test("should redirect to home if user already logged in", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          email: "superadmin@umkm.go.id", // Mock data for localStorage
          name: "admin123", // Mock data for localStorage
        })
      );
      localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVta20xQHVta20uZ28uaWQiLCJleHAiOjE3NjU3NTUyMjAsImlhdCI6MTc2NTQ5NjAyMCwiaWQiOjEwMSwiaXNfYWRtaW4iOnRydWUsIm5hbWUiOiJVTUtNIFVzZXIgMSIsInBlcm1pc3Npb25zIjpbIlZJRVdfVFJBSU5JTkciXSwicm9sZSI6NCwicm9sZV9uYW1lIjoicGVsYWt1X3VzYWhhIn0.MIusbQkW_6479_1Pf1gad49SFgtjI1UT9KeueZDRbaw"
      );
    });

    await page.goto("/login");
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });

  test("should allow user to type in email and password fields", async ({
    page,
  }) => {
    const testEmail = "test@example.com";
    const testPassword = "testpassword123";

    await page.getByLabel("Email").fill(testEmail);
    await expect(page.getByLabel("Email")).toHaveValue(testEmail);

    await page.getByLabel("Password").fill(testPassword);
    await expect(page.getByLabel("Password")).toHaveValue(testPassword);
  });

  test("should have proper styling and layout", async ({ page }) => {
    const container = page.locator(".min-h-screen");
    await expect(container).toHaveClass(/bg-sky-50/);

    const card = page.locator("form").locator("..");
    await expect(card).toBeVisible();

    const logo = page.locator('img[alt="UMKMGo Logo"]');
    await expect(logo).toHaveClass(/h-28/);
    await expect(logo).toHaveClass(/w-28/);
  });

  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "UMKMGo" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe("Login Page - Accessibility", () => {
  test("should have proper ARIA labels and roles", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    await expect(emailInput).toHaveAttribute("id", "email");
    await expect(passwordInput).toHaveAttribute("id", "password");

    const submitButton = page.getByRole("button", { name: "Masuk" });
    await expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/login");

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Email")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Password")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Masuk" })).toBeFocused();

    // Submit dengan Enter
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);
    await page.keyboard.press("Enter");

    await page.waitForURL("/", {
      timeout: testConfig.timeouts.navigation,
      waitUntil: "networkidle",
    });
  });
});
