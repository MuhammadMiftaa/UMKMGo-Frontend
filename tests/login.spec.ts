import { test, expect } from "@playwright/test";
import { testConfig, logTestConfig } from "./helpers/config";

test.describe("Login Page", () => {
  test.beforeAll(() => {
    // Log config saat test dimulai (hanya di CI)
    if (testConfig.isCI) {
      logTestConfig();
    }
  });

  test.beforeEach(async ({ page }) => {
    // Navigasi ke halaman login sebelum setiap test
    await page.goto("/login");
  });

  test("should display login form elements", async ({ page }) => {
    // Cek apakah logo UMKMGo ditampilkan
    const logo = page.locator('img[alt="UMKMGo Logo"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/dblibr1t2/image/upload/v1762742634/umkmgo_logo.png"
    );

    // Cek heading
    await expect(page.getByRole("heading", { name: "UMKMGo" })).toBeVisible();
    await expect(page.getByText("Masuk ke Dashboard Admin")).toBeVisible();

    // Cek input fields
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    // Cek placeholder
    await expect(page.getByPlaceholder("admin@umkm.go.id")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();

    // Cek button submit
    await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk" })).toBeEnabled();
  });

  test("should have correct input types", async ({ page }) => {
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    // Cek type attribute
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Cek required attribute
    await expect(emailInput).toHaveAttribute("required", "");
    await expect(passwordInput).toHaveAttribute("required", "");
  });

  test("should not submit form with empty fields", async ({ page }) => {
    // Klik button submit tanpa mengisi form
    await page.getByRole("button", { name: "Masuk" }).click();

    // Browser validation akan mencegah submit
    // Pastikan masih di halaman login (tidak redirect)
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show error message for invalid credentials", async ({
    page,
  }) => {
    // Isi form dengan kredensial yang salah
    await page.getByLabel("Email").fill("wrong@email.com");
    await page.getByLabel("Password").fill("wrongpassword");

    // Submit form
    await page.getByRole("button", { name: "Masuk" }).click();

    // Tunggu dan cek error message
    await expect(page.getByText("Email atau password salah")).toBeVisible();

    // Pastikan masih di halaman login
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show loading state when submitting", async ({ page }) => {
    // Isi form
    await page.getByLabel("Email").fill("test@email.com");
    await page.getByLabel("Password").fill("password123");

    // Submit form
    const submitButton = page.getByRole("button", { name: "Masuk" });
    await submitButton.click();

    // Cek loading state (button text berubah dan disabled)
    await expect(page.getByRole("button", { name: "Masuk..." })).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    // GUNAKAN credentials dari config (GitLab CI Variables atau .env.local)
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);

    // Submit form
    await page.getByRole("button", { name: "Masuk" }).click();

    // Tunggu redirect ke dashboard
    await page.waitForURL("/", { timeout: testConfig.timeouts.navigation });
    await expect(page).toHaveURL("/");

    // Verify user logged in (check dashboard elements)
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  });

  test("should redirect to home if user already logged in", async ({
    page,
  }) => {
    // Set localStorage untuk simulasi user sudah login
    await page.addInitScript(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          email: "superadmin@umkm.go.id",
          name: "admin123",
        })
      );
      localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVta20xQHVta20uZ28uaWQiLCJleHAiOjE3NjU3NTUyMjAsImlhdCI6MTc2NTQ5NjAyMCwiaWQiOjEwMSwiaXNfYWRtaW4iOnRydWUsIm5hbWUiOiJVTUtNIFVzZXIgMSIsInBlcm1pc3Npb25zIjpbIlZJRVdfVFJBSU5JTkciXSwicm9sZSI6NCwicm9sZV9uYW1lIjoicGVsYWt1X3VzYWhhIn0.MIusbQkW_6479_1Pf1gad49SFgtjI1UT9KeueZDRbaw"
      );
    });

    // Coba akses halaman login
    await page.goto("/login");

    // Seharusnya langsung redirect ke home
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });

  test("should allow user to type in email and password fields", async ({
    page,
  }) => {
    const testEmail = "test@example.com";
    const testPassword = "testpassword123";

    // Ketik di email field
    await page.getByLabel("Email").fill(testEmail);
    await expect(page.getByLabel("Email")).toHaveValue(testEmail);

    // Ketik di password field
    await page.getByLabel("Password").fill(testPassword);
    await expect(page.getByLabel("Password")).toHaveValue(testPassword);
  });

  test("should have proper styling and layout", async ({ page }) => {
    // Cek background color (sky-50)
    const container = page.locator(".min-h-screen");
    await expect(container).toHaveClass(/bg-sky-50/);

    // Cek card ada dan centered
    const card = page.locator("form").locator("..");
    await expect(card).toBeVisible();

    // Cek logo size
    const logo = page.locator('img[alt="UMKMGo Logo"]');
    await expect(logo).toHaveClass(/h-28/);
    await expect(logo).toHaveClass(/w-28/);
  });

  test("should work on mobile viewport", async ({ page }) => {
    // Set viewport ke mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");

    // Cek semua elemen masih visible dan accessible
    await expect(page.getByRole("heading", { name: "UMKMGo" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    // Isi dengan email format yang salah
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Masuk" }).click();

    // Browser validation akan mencegah submit karena type="email"
    // Pastikan masih di halaman login
    await expect(page).toHaveURL(/.*login/);
  });
});

// Test untuk accessibility
test.describe("Login Page - Accessibility", () => {
  test("should have proper ARIA labels and roles", async ({ page }) => {
    await page.goto("/login");

    // Cek labels terhubung dengan inputs
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    await expect(emailInput).toHaveAttribute("id", "email");
    await expect(passwordInput).toHaveAttribute("id", "password");

    // Cek button role
    const submitButton = page.getByRole("button", { name: "Masuk" });
    await expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/login");

    // Tab navigation
    await page.keyboard.press("Tab"); // Focus ke email
    await expect(page.getByLabel("Email")).toBeFocused();

    await page.keyboard.press("Tab"); // Focus ke password
    await expect(page.getByLabel("Password")).toBeFocused();

    await page.keyboard.press("Tab"); // Focus ke button
    await expect(page.getByRole("button", { name: "Masuk" })).toBeFocused();

    // Submit dengan Enter - GUNAKAN credentials dari config
    await page.getByLabel("Email").fill(testConfig.credentials.email);
    await page.getByLabel("Password").fill(testConfig.credentials.password);
    await page.keyboard.press("Enter");

    // Form seharusnya ter-submit dan redirect
    await page.waitForURL("/", {
      timeout: testConfig.timeouts.navigation,
      waitUntil: "networkidle",
    });
  });
});
