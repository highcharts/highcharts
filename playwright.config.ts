import { defineConfig, devices, type ReporterDescription } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: (() => {
        const projectArgs: string[] = [];
        for (let index = 0; index < process.argv.length; index += 1) {
            const arg = process.argv[index];
            if (arg === '--project' && process.argv[index + 1]) {
                projectArgs.push(process.argv[index + 1]);
                index += 1;
                continue;
            }
            if (arg.startsWith('--project=')) {
                projectArgs.push(arg.slice('--project='.length));
            }
        }

        const shouldAddVisualReporter =
            projectArgs.length === 0 ||
            projectArgs.includes('visual');

        const reporters: ReporterDescription[] = [['html', { open: 'never' }]];
        if (shouldAddVisualReporter) {
            reporters.push([
                './tests/visual/visual-reporter.ts',
                { outputFile: 'test/visual-test-results.json' }
            ]);
        }

        return reporters;
    })(),
    use: {
        trace: 'on-first-retry',
        baseURL: 'http://localhost',
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
                headless: true,
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
            name: 'visual',
            testDir: './tests/visual',
            use: {
                ...devices['Desktop Chrome'],
                headless: true,
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
            dependencies: [
                'setup-dashboards',
                'setup-highcharts'
            ],
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
            name: 'setup-grid-lite',
            testMatch: 'setup-grid-lite.mts',
        },
        {
            name: 'grid-lite',
            testDir: './tests/grid/grid-lite',
            testMatch: '**/*.spec.ts',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup-grid-lite'],
        },
        {
            name: 'grid-lite-firefox',
            testDir: './tests/grid/grid-lite',
            testMatch: '**/*.spec.ts',
            use: { ...devices['Desktop Firefox'] },
            dependencies: ['setup-grid-lite'],
        },
        {
            name: 'grid-lite-webkit',
            testDir: './tests/grid/grid-lite',
            testMatch: '**/*.spec.ts',
            use: { ...devices['Desktop Safari'] },
            dependencies: ['setup-grid-lite'],
        },
        {
            name: 'setup-grid-pro',
            testMatch: 'setup-grid-pro.mts',
        },
        {
            name: 'grid-pro',
            testDir: './tests/grid/grid-pro',
            testMatch: '**/*.spec.ts',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup-grid-pro'],
        },
        {
            name: 'grid-pro-firefox',
            testDir: './tests/grid/grid-pro',
            testMatch: '**/*.spec.ts',
            use: { ...devices['Desktop Firefox'] },
            dependencies: ['setup-grid-pro'],
        },
        {
            name: 'grid-pro-webkit',
            testDir: './tests/grid/grid-pro',
            testMatch: '**/*.spec.ts',
            use: { ...devices['Desktop Safari'] },
            dependencies: ['setup-grid-pro'],
        },
        {
            name: 'grid-shared',
            testDir: './tests/grid/shared',
            testMatch: '**/*.spec.ts',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup-grid-lite', 'setup-grid-pro'],
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
