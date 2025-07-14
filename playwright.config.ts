import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { open: 'never' }]],
    use: {
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'setup',
            testMatch: 'setup.ts',
        },
        {
            name: 'internal',
            testDir: './tests/internal',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'default',
            testIgnore: ['**/internal/**'],
            use: {
                ...devices['Desktop Chrome'],
                ...devices['Desktop Firefox'],
                ...devices['Desktop safari']
            },
            dependencies: ['setup'],
        },
    ],
});
