/* eslint-disable playwright/no-conditional-in-test */
import { test, expect, setupRoutes } from '../fixtures.ts';
import { getKarmaScripts, getSample } from '../utils.ts';
import { join, dirname, relative } from 'node:path';
import { glob } from 'glob';

import { waitForScriptLoadWithTimeout} from '../qunit/utils/timeout-handler.ts';


test.describe('Visual tests', () => {
    test.describe.configure({
        timeout: 30_000,
        // retries: 1 // retry once
    });

    // Track test results for summary
    const testResults = {
        passed: 0,
        failed: 0,
        total: 0
    };

    test.beforeEach(async ({ page }) => {

        await page.setViewportSize({ width: 800, height: 600 });
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
            'samples/highcharts/demo/gauge-clock/demo.js',
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
        test(samplePath + '', async ({ page }) =>{
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
                content: sample.script
            });
            await waitForScriptLoadWithTimeout(
                page,
                scriptPromise,
                samplePath,
                10000 // 10 second timeout for script loading
            );

            await expect(page).toHaveScreenshot();
        });
    }
});
