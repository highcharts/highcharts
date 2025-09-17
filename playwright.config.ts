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
            name: 'setup-highcharts',
            testMatch: 'setup-highcharts.mts',
        },
        {
            name: 'highcharts',
            testDir: './tests/highcharts',
            use: {
                ...devices['Desktop Chrome'],
                ...devices['Desktop Firefox'],
                ...devices['Desktop safari']
            },
            dependencies: ['setup-highcharts'],
        },
        {
            name: 'qunit',
            testDir: './tests/qunit',
            use: {
                ...devices['Desktop Chrome'],
                ...devices['Desktop Firefox'],
            },
            dependencies: ['setup-highcharts'],
        },
        {
            name: 'setup-dashboards',
            testMatch: 'setup-dashboards.mts',
        },
        {
            name: 'dashboards',
            testDir: './tests/dashboards',
            use: {
                ...devices['Desktop Chrome'],
                ...devices['Desktop Firefox'],
                ...devices['Desktop safari']
            },
            dependencies: ['setup-dashboards'],
        },
        {
            // tests for mocking and utils and other playwright behaviour
            name: 'internal',
            testDir: './tests/internal',
            use: { ...devices['Desktop Chrome'] },
            dependencies: [
                'setup-dashboards',
                'setup-highcharts'
            ],
        },
    ],
});
