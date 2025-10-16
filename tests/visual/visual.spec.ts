/* eslint-disable playwright/no-conditional-in-test */
import { Page, BrowserContext } from '@playwright/test';
import type { ElementHandle } from '@playwright/test';
import { test, expect, setupRoutes } from '../fixtures.ts';
import { getKarmaScripts, getSample } from '../utils.ts';
import { join, dirname, relative } from 'node:path';
import { glob } from 'glob';

import { waitForScriptLoadWithTimeout} from '../qunit/utils/timeout-handler.ts';


function transformVisualSampleScript(script: string | undefined): string {
    let transformed = script ?? '';

    transformed = transformed.replace(/setInterval/g, 'Highcharts.noop');

    transformed = transformed.replace(
        /enableSimulation:\s*true/g,
        'enableSimulation: false'
    );

    transformed = transformed.replace(/(\s)animation:\s/g, '$1_animation: ');

    return transformed;
}

const FIXED_CLOCK_TIME = '2024-01-01T00:00:00.000Z';

test.describe('Visual tests', () => {
    test.describe.configure({
        timeout: 30_000,
        // retries: 1 // retry once
    });

    let page: Page;
    let context: BrowserContext;

    // Track test results for summary
    const testResults = {
        passed: 0,
        failed: 0,
        total: 0
    };

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext({
            viewport: { width: 800, height: 600 }
        });
        await context.clock.install({ time: FIXED_CLOCK_TIME });
        page = await context.newPage();
        await context.clock.setFixedTime(FIXED_CLOCK_TIME);

        await setupRoutes(page); // need to setup routes separately

        await page.setContent(`
        <div id="container" style="width: 600px; margin 0 auto"></div>
        <div id="output"></div>`);

        const scripts = [
            ...(await getKarmaScripts()),
            join('test', 'call-analyzer.js'),
            join('test', 'test-utilities.js'),
            join('tmp', 'json-sources.js'),
            join('test', 'karma-setup.js')
        ];

        for (const script of scripts) {
            await page.addScriptTag({
                path: script
            });
        }

        await page.evaluate(() => {
            if (window.Highcharts) {
                window.Highcharts.setOptions({
                    chart: {
                        events: {
                            load: function () {
                                (window as any).setHCStyles(this);
                            }
                        }
                    }
                });
            }
        });
    });

    test.afterEach(async () => {
        if (!page) {
            return;
        }
        await page.evaluate(() => {
            const scripts = document.querySelectorAll('#visual-test-script');
            scripts.forEach((script) => script.remove());

            const container = document.getElementById('container');
            if (container) {
                container.innerHTML = '';
            }

            const output = document.getElementById('output');
            if (output) {
                output.innerHTML = '';
            }

            if (window.Highcharts && Array.isArray(window.Highcharts.charts)) {
                window.Highcharts.charts.forEach((chart) => {
                    if (chart && typeof chart.destroy === 'function') {
                        try {
                            chart.destroy();
                        } catch (error) {
                            console.error(
                                '[visual cleanup] chart.destroy failed',
                                error
                            );
                        }
                    }
                });
            }
        });
    });

    test.afterAll(async () => {
        if (context) {
            await context.close();
        }
    });

    const pathEnv = process.env.VISUAL_TEST_PATH ?? '';
    const pathFilters = pathEnv
        .split(/[,;\n]/)
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => value.replace(/\\/g, '/'));

    const samples = glob.sync(['samples/**/demo.js'], {
        ignore: [
            'samples/unit-tests/**',
            'samples/issues/**',
            'samples/mapdata/**',
            // --- VISUAL TESTS ---

            // Custom data source
            'samples/highcharts/blog/annotations-aapl-iphone/demo.js',
            'samples/highcharts/blog/gdp-growth-annual/demo.js',
            'samples/highcharts/blog/gdp-growth-multiple-request-v2/demo.js',
            'samples/highcharts/blog/gdp-growth-multiple-request/demo.js',
            'samples/highcharts/website/xmas-2021/demo.js',

            // Error #13, renders to other divs than #container. Sets global
            // options.
            'samples/highcharts/demo/bullet-graph/demo.js',
            // Network loading?
            'samples/highcharts/demo/combo-meteogram/demo.js',

            // CSV data, parser fails - why??
            'samples/highcharts/demo/line-csv/demo.js',

            // Clock
            'samples/highcharts/demo/dynamic-update/demo.js',
            'samples/highcharts/demo/gauge-vu-meter/demo.js',

            // Too heavy
            'samples/highcharts/demo/parallel-coordinates/demo.js',
            'samples/highcharts/demo/sparkline/demo.js',

            // Maps
            'samples/maps/demo/map-pies/demo.js', // advanced data
            'samples/maps/demo/us-counties/demo.js', // advanced data
            'samples/maps/plotoptions/series-animation-true/demo.js', // animation
            'samples/highcharts/blog/map-europe-electricity-price/demo.js', // strange fails, remove this later

            // Unknown error
            'samples/highcharts/boost/arearange/demo.js',
            'samples/highcharts/boost/scatter-smaller/demo.js',
            'samples/highcharts/data/google-spreadsheet/demo.js',

            // Various
            'samples/highcharts/data/delimiters/demo.js', // data island
            'samples/highcharts/css/exporting/demo.js', // advanced demo
            'samples/highcharts/css/pattern/demo.js', // styled mode, setOptions
            'samples/highcharts/studies/logistics/demo.js', // overriding

            // Failing on Edge only
            'samples/unit-tests/pointer/members/demo.js',

            // visual tests excluded for now due to failure
            'samples/highcharts/demo/funnel3d/demo.js',
            'samples/highcharts/demo/live-data/demo.js',
            'samples/highcharts/demo/organization-chart/demo.js',
            'samples/highcharts/demo/pareto/demo.js',
            'samples/highcharts/demo/pyramid3d/demo.js',
            'samples/highcharts/demo/synchronized-charts/demo.js',

            // Visual test fails due to external library used
            'samples/highcharts/demo/combo-regression/demo.js',
        ],
        absolute: true
    });

    const filteredSamples = pathFilters.length ?
        samples.filter((samplePath) => {
            const relativePath = relative(process.cwd(), samplePath).replace(/\\/g, '/');
            return pathFilters.some(
                (pathFilter) =>
                    relativePath.includes(pathFilter) ||
                    samplePath.includes(pathFilter)
            );
        }) :
        samples;

    for (const samplePath of filteredSamples){
        test(samplePath + '', async () =>{
            if (context) {
                await context.clock.setFixedTime(FIXED_CLOCK_TIME);
            }
            const sample = getSample(dirname(samplePath));

            if (
                sample.details?.requiresManualTesting ||
                sample.details?.skipTest
            ) {
                // eslint-disable-next-line playwright/no-skipped-test
                test.skip();
            }

            testResults.total++;
            // Load script with timeout handling
            const scriptPromise = page.addScriptTag({
                content: transformVisualSampleScript(sample.script)
            });
            const scriptHandle = await waitForScriptLoadWithTimeout(
                page,
                scriptPromise,
                samplePath,
                10000 // 10 second timeout for script loading
            ) as ElementHandle<HTMLScriptElement> | null;
            if (scriptHandle) {
                await scriptHandle.evaluate((element: HTMLScriptElement) => {
                    element.id = 'visual-test-script';
                });
            }

            await expect(page).toHaveScreenshot();
        });
    }
});
