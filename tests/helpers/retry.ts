import { Page } from "@playwright/test";

/**
 * Retry action hingga maksimal retries atau sampai berhasil
 * @param action - Function async yang akan di-retry
 * @param maxRetries - Maksimal percobaan (default: 3)
 * @param delay - Delay antara retry dalam ms (default: 1000)
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
      return await action();
    } catch (error) {
      lastError = error as Error;
      console.log(`❌ Attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `❌ Action failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Retry action dengan kondisi khusus (conditional retry)
 * @param action - Function async yang akan di-retry
 * @param condition - Function untuk validasi hasil (return true jika berhasil)
 * @param maxRetries - Maksimal percobaan (default: 3)
 * @param delay - Delay antara retry dalam ms (default: 1000)
 */
export async function retryUntil<T>(
  action: () => Promise<T>,
  condition: (result: T) => boolean | Promise<boolean>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastResult: T | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
      lastResult = await action();

      const conditionMet = await condition(lastResult);
      if (conditionMet) {
        console.log(`✅ Condition met on attempt ${attempt}`);
        return lastResult;
      }

      console.log(`⚠️  Condition not met on attempt ${attempt}`);

      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed:`, (error as Error).message);

      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error(
    `❌ Condition not met after ${maxRetries} attempts. Last result: ${JSON.stringify(lastResult)}`
  );
}

/**
 * Retry navigation hingga URL sesuai expected
 * @param page - Playwright page object
 * @param url - URL yang akan di-navigate
 * @param expectedUrl - Expected URL pattern (regex atau string)
 * @param maxRetries - Maksimal percobaan (default: 3)
 * @param delay - Delay antara retry dalam ms (default: 1000)
 */
export async function retryNavigation(
  page: Page,
  url: string,
  expectedUrl: string | RegExp,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<void> {
  return retryAction(
    async () => {
      await page.goto(url);
      await page.waitForURL(expectedUrl, { timeout: 5000 });
    },
    maxRetries,
    delay
  );
}

/**
 * Retry click element hingga sukses
 * @param page - Playwright page object
 * @param selector - Selector element yang akan di-click
 * @param options - Options untuk click
 * @param maxRetries - Maksimal percobaan (default: 3)
 * @param delay - Delay antara retry dalam ms (default: 1000)
 */
export async function retryClick(
  page: Page,
  selector: string,
  options?: Parameters<Page["click"]>[1],
  maxRetries: number = 3,
  delay: number = 1000
): Promise<void> {
  return retryAction(
    async () => {
      await page.click(selector, options);
    },
    maxRetries,
    delay
  );
}

/**
 * Retry hingga element visible
 * @param page - Playwright page object
 * @param selector - Selector element yang ditunggu
 * @param maxRetries - Maksimal percobaan (default: 3)
 * @param delay - Delay antara retry dalam ms (default: 1000)
 */
export async function retryWaitForSelector(
  page: Page,
  selector: string,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<void> {
  return retryAction(
    async () => {
      await page.waitForSelector(selector, { timeout: 5000 });
    },
    maxRetries,
    delay
  );
}
