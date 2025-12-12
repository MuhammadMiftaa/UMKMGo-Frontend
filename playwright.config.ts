import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration untuk GitLab CI/CD
 * Mendukung staging dan production environment
 * 
 * Environment Variables yang digunakan:
 * - PLAYWRIGHT_BASE_URL / TEST_BASE_URL: Base URL untuk testing
 * - TEST_EMAIL: Email credentials untuk login
 * - TEST_PASSWORD: Password credentials untuk login
 * - CI: Flag untuk CI environment
 */

// Helper untuk detect environment
const getEnvironment = () => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.TEST_BASE_URL || '';
  
  if (baseURL.includes('staging')) {
    return 'staging';
  } else if (baseURL.includes('umkmgo.miftech.web.id')) {
    return 'production';
  } else {
    return 'local';
  }
};

// Environment-specific configurations
const envConfigs = {
  local: {
    baseURL: 'http://localhost:5173',
    apiURL: 'http://localhost:8080/v1',
  },
  staging: {
    baseURL: 'https://umkmgo-staging.miftech.web.id',
    apiURL: 'https://api-umkmgo-staging.miftech.web.id/v1',
  },
  production: {
    baseURL: 'https://umkmgo.miftech.web.id',
    apiURL: 'https://api-umkmgo.miftech.web.id/v1',
  },
};

const currentEnv = getEnvironment();
const envConfig = envConfigs[currentEnv as keyof typeof envConfigs] || envConfigs.staging;

// Log configuration (only in CI)
if (process.env.CI) {
  console.log('🔧 Playwright Test Configuration:');
  console.log(`   Environment: ${currentEnv}`);
  console.log(`   Base URL: ${envConfig.baseURL}`);
  console.log(`   API URL: ${envConfig.apiURL}`);
  console.log(`   Test Email: ${process.env.TEST_EMAIL || 'superadmin@umkm.go.id'}`);
  console.log(`   Password: ${process.env.TEST_PASSWORD ? '***SET***' : '***NOT SET***'}`);
  console.log(`   Is CI: ${!!process.env.CI}`);
}

/**
 * Playwright Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    // Uncomment untuk JSON reporter jika diperlukan
    // ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 
             process.env.TEST_BASE_URL || 
             envConfig.baseURL,
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure (only in CI to save artifacts) */
    video: process.env.CI ? 'retain-on-failure' : 'off',
    
    /* Maximum time each action such as `click()` can take */
    actionTimeout: 10000,
    
    /* Maximum time for navigation */
    navigationTimeout: 30000,
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Tambahan untuk headless mode di CI
        launchOptions: {
          args: process.env.CI ? [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ] : [],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests (hanya untuk local) */
  webServer: !process.env.CI ? {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120000,
  } : undefined,
});

/**
 * Export helper untuk digunakan di test files jika diperlukan
 * Cara pakai: import { testConfig } from '../playwright.config'
 */
export const testConfig = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 
           process.env.TEST_BASE_URL || 
           envConfig.baseURL,
  apiURL: envConfig.apiURL,
  credentials: {
    email: process.env.TEST_EMAIL || 'superadmin@umkm.go.id',
    password: process.env.TEST_PASSWORD || 'admin123',
  },
  timeouts: {
    navigation: 30000,
    action: 10000,
    assertion: 5000,
  },
  isCI: !!process.env.CI,
  environment: currentEnv,
};