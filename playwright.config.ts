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
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup-highcharts'],
        },
        {
            name: 'highcharts-firefox',
            testDir: './tests/highcharts',
            use: { ...devices['Desktop Firefox'] },
            dependencies: ['setup-highcharts'],
        },
        {
            name: 'highcharts-webkit',
            testDir: './tests/highcharts',
            use: { ...devices['Desktop Safari'] },
            dependencies: ['setup-highcharts'],
        },
        {
            name: 'qunit',
            testDir: './tests/qunit',
            use: {
                ...devices['Desktop Chrome'],
                headless: process.env.CI ? true : false,
                launchOptions: {
                    args: [
                        '--enable-gpu',
                        '--ignore-gpu-blocklist',
                        '--enable-zero-copy',
                        '--use-angle=gl',
                        '--use-gl=angle',
                        '--disable-software-rasterizer'
                    ]
                }
            },
            dependencies: ['setup-highcharts'],
        },
        {
            name: 'qunit-firefox',
            testDir: './tests/qunit',
            use: {
                ...devices['Desktop Firefox'],
                headless: true,
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
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup-dashboards'],
        },
        {
            name: 'dashboards-firefox',
            testDir: './tests/dashboards',
            use: { ...devices['Desktop Firefox'] },
            dependencies: ['setup-dashboards'],
        },
        {
            name: 'dashboards-webkit',
            testDir: './tests/dashboards',
            use: { ...devices['Desktop Safari'] },
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
