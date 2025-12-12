# Retry Helper Functions untuk Playwright

File helper ini menyediakan berbagai function untuk melakukan retry/iterasi di Playwright tests.

## Functions yang Tersedia

### 1. `retryAction` - Retry Basic

Retry action hingga maksimal retries atau sampai berhasil.

**Signature:**

```typescript
async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T>;
```

**Contoh Penggunaan:**

```typescript
import { retryAction } from "./helpers/retry";

// Retry navigation dan click
await retryAction(
  async () => {
    await page.goto("/training");
    await page.getByRole("link", { name: "Detail" }).nth(0).click();
    await expect(page).toHaveURL(/application/);
  },
  3,
  1000
); // 3 kali retry, delay 1 detik

// Retry dengan custom retries
await retryAction(
  async () => {
    await page.click("#submit-button");
    await expect(page.getByText("Success")).toBeVisible();
  },
  5, // 5 kali retry
  2000 // delay 2 detik
);
```

### 2. `retryUntil` - Retry dengan Kondisi

Retry hingga kondisi tertentu terpenuhi.

**Signature:**

```typescript
async function retryUntil<T>(
  action: () => Promise<T>,
  condition: (result: T) => boolean | Promise<boolean>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T>;
```

**Contoh Penggunaan:**

```typescript
import { retryUntil } from "./helpers/retry";

// Retry hingga element count sesuai
const elements = await retryUntil(
  async () => await page.$$(".item"),
  (elements) => elements.length >= 5, // kondisi: minimal 5 items
  3,
  1000
);

// Retry hingga text content sesuai
const text = await retryUntil(
  async () => await page.textContent("#status"),
  (text) => text === "Completed",
  5,
  2000
);
```

### 3. `retryNavigation` - Retry Navigation

Retry navigation hingga URL sesuai expected.

**Signature:**

```typescript
async function retryNavigation(
  page: Page,
  url: string,
  expectedUrl: string | RegExp,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<void>;
```

**Contoh Penggunaan:**

```typescript
import { retryNavigation } from "./helpers/retry";

// Retry goto dengan URL validation
await retryNavigation(
  page,
  "/training",
  /\/training$/, // expected URL pattern
  3,
  1000
);

// Retry dengan exact URL
await retryNavigation(
  page,
  "/dashboard",
  "http://localhost:5173/dashboard",
  5,
  2000
);
```

### 4. `retryClick` - Retry Click Element

Retry click element hingga sukses.

**Signature:**

```typescript
async function retryClick(
  page: Page,
  selector: string,
  options?: ClickOptions,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<void>;
```

**Contoh Penggunaan:**

```typescript
import { retryClick } from "./helpers/retry";

// Retry click button
await retryClick(page, "#submit-button", {}, 3, 1000);

// Retry click dengan options
await retryClick(page, ".menu-item", { force: true }, 5, 2000);
```

### 5. `retryWaitForSelector` - Retry Wait for Element

Retry hingga element visible.

**Signature:**

```typescript
async function retryWaitForSelector(
  page: Page,
  selector: string,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<void>;
```

**Contoh Penggunaan:**

```typescript
import { retryWaitForSelector } from "./helpers/retry";

// Retry wait for element
await retryWaitForSelector(page, "#content", 3, 1000);

// Retry wait dengan lebih banyak attempts
await retryWaitForSelector(page, ".loading-complete", 10, 500);
```

## Contoh Lengkap dalam Test

```typescript
import { test, expect } from "@playwright/test";
import { retryAction, retryNavigation, retryClick } from "./helpers/retry";

test.describe("Example Test with Retry", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "user@example.com");
    await page.fill("#password", "password");
    await retryClick(page, "#login-button", {}, 3, 1000);
  });

  test("should navigate and verify", async ({ page }) => {
    // Retry complex action
    await retryAction(
      async () => {
        await page.goto("/training");
        await page.getByRole("link", { name: "Detail" }).nth(0).click();
        await expect(page).toHaveURL(/application/);
      },
      3,
      1000
    );

    // Verify content
    await expect(page.getByText("Application Details")).toBeVisible();
  });

  test("should handle unstable navigation", async ({ page }) => {
    // Retry navigation
    await retryNavigation(page, "/dashboard", /\/dashboard$/, 5, 2000);

    await expect(page.getByTestId("dashboard-title")).toBeVisible();
  });
});
```

## Tips Penggunaan

1. **Gunakan `retryAction` untuk:**
   - Action yang mungkin gagal karena timing issues
   - Navigation yang kompleks
   - Click yang butuh element loading dulu

2. **Gunakan `retryUntil` untuk:**
   - Menunggu data loading dengan kondisi spesifik
   - Validasi state yang berubah-ubah
   - Polling hingga kondisi terpenuhi

3. **Gunakan `retryNavigation` untuk:**
   - Navigation yang kadang redirect
   - URL yang butuh waktu untuk update

4. **Sesuaikan `maxRetries` dan `delay`:**
   - Fast operations: 3 retries, 500ms delay
   - Normal operations: 3 retries, 1000ms delay
   - Slow operations: 5-10 retries, 2000ms delay

## Parameter Default

- `maxRetries`: 3 (default)
- `delay`: 1000ms / 1 detik (default)

Anda bisa override sesuai kebutuhan!
