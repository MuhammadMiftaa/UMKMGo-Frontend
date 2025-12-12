/**
 * Test Configuration Helper
 * Centralized configuration untuk Playwright tests
 * Menggunakan environment variables dari GitLab CI atau .env.local untuk development
 */

export const testConfig = {
  // Base URL untuk testing - menggunakan TEST_BASE_URL dari GitLab CI Variables
  baseURL: process.env.TEST_BASE_URL || "http://localhost:5173",

  // API URL
  apiURL:
    process.env.VITE_API_URL ||
    "https://api-umkmgo-staging.miftech.web.id/v1",

  // Test credentials - menggunakan TEST_EMAIL dan TEST_PASSWORD dari GitLab CI Variables
  credentials: {
    email: process.env.TEST_EMAIL || "superadmin@umkm.go.id",
    password: process.env.TEST_PASSWORD || "admin123",
  },

  // Test timeouts
  timeouts: {
    navigation: 30000, // 30 seconds
    action: 10000, // 10 seconds
    assertion: 5000, // 5 seconds
  },

  // Environment detection
  isCI: !!process.env.CI,
  isLocal: !process.env.CI,

  // Retry configuration
  retry: {
    maxRetries: process.env.CI ? 2 : 0,
    delay: 1000,
  },
};

/**
 * Helper untuk get environment-specific config
 */
export const getEnvironmentConfig = () => {
  // Deteksi environment berdasarkan TEST_BASE_URL
  const baseURL = process.env.TEST_BASE_URL || "";
  
  if (baseURL.includes("staging")) {
    return {
      environment: "staging",
      baseURL: "https://umkmgo-staging.miftech.web.id",
      apiURL: "https://api-umkmgo-staging.miftech.web.id/v1",
    };
  } else if (baseURL.includes("production") || baseURL.includes("umkmgo.miftech.web.id")) {
    return {
      environment: "production",
      baseURL: "https://umkmgo.miftech.web.id",
      apiURL: "https://api-umkmgo.miftech.web.id/v1",
    };
  } else {
    return {
      environment: "local",
      baseURL: "http://localhost:5173",
      apiURL: "http://localhost:8080/v1",
    };
  }
};

/**
 * Helper untuk logging (tidak log sensitive data)
 */
export const logTestConfig = () => {
  const envConfig = getEnvironmentConfig();
  
  console.log("🔧 Test Configuration:");
  console.log(`   Environment: ${envConfig.environment}`);
  console.log(`   Base URL: ${testConfig.baseURL}`);
  console.log(`   API URL: ${testConfig.apiURL}`);
  console.log(`   Email: ${testConfig.credentials.email}`);
  console.log(`   Password: ${testConfig.credentials.password ? "***SET***" : "***NOT SET***"}`);
  console.log(`   Is CI: ${testConfig.isCI}`);
  console.log(`   Retry: ${testConfig.retry.maxRetries} times`);
  console.log(`   Browser Projects: chromium, firefox, webkit`);
};

export default testConfig;