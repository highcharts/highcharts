import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./test/playwright",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3030/samples/",

        viewport: { width: 1280, height: 720 },
        trace: "on-first-retry",
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: "node utils/server --localOnly",
        url: "http://127.0.0.1:3030",
        reuseExistingServer: !process.env.CI,
    },
});
