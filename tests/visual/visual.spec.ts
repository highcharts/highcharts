/* eslint-disable playwright/no-conditional-in-test */
import type { Page, BrowserContext } from '@playwright/test';
import { test, expect} from '@playwright/test';
import { setupRoutes } from '../fixtures.ts';
import { getKarmaScripts, getSample, setTestingOptions } from '../utils.ts';
import { join, dirname, relative } from 'node:path';
import { glob } from 'glob';

function transformVisualSampleScript(script: string | undefined): string {
    let transformed = script ?? '';

    transformed = transformed.replace(/setInterval/g, 'Highcharts.noop');

    transformed = transformed.replace(
        /enableSimulation:\s*true/g,
        'enableSimulation: false'
    );

    transformed = transformed.replace(/(\s)animation:\s/g, '$1_animation: ');

    return `;(function () {\n${transformed.trim()}\n}).call(window);`;
}

const FIXED_CLOCK_TIME = '2024-01-01T00:00:00.000Z';

const defaultPageContent = '<div id="container" style="width: 600px; margin 0 auto"></div>';

const pageTemplate = (bodyContent = '') =>
    `<!DOCTYPE html>
<html>
    <body>
        <div data-test-container>
            ${bodyContent}
        </div>
    </body>
</html>`;

test.describe('Visual tests', () => {
    test.describe.configure({
        timeout: 5_000,
    });

    let page: Page | undefined;
    let context: BrowserContext | undefined;

    test.beforeAll(async ({ browser }) => {
        context ??= await browser.newContext({
            viewport: { width: 800, height: 600 }
        });

        await context.setOffline(true);

        await context.clock.install({ time: FIXED_CLOCK_TIME });
        page = await context.newPage();
        await context.clock.setFixedTime(FIXED_CLOCK_TIME);

        await setupRoutes(page); // need to setup routes separately

        await page.setContent(pageTemplate(defaultPageContent));

        const scripts = [
            ...(await getKarmaScripts()),
            join('tmp', 'json-sources.js'),
            join('tests', 'visual', 'visual-setup.js')
        ];

        for (const script of scripts) {
            await page.addScriptTag({
                path: script
            });
        }

        await page.waitForFunction(
            () => window.HCVisualSetup?.initialized === true
        );
        await page.evaluate(() => {
            window.HCVisualSetup?.configure({ mode: 'fast' });
            window.HCVisualSetup?.markOptionsClean();
        });
    });

    test.afterEach(async () => {
        if (!page) {
            return;
        }
        await page.evaluate(() => {
            const elementsToRemove = document.querySelectorAll(
                '#visual-test-script, #visual-test-styles'
            );
            elementsToRemove.forEach((el) => el.remove());
        });

        await page.evaluate(() => window.HCVisualSetup?.afterSample());
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
            page = undefined;
        }
        if (context) {
            await context.close();
            context = undefined;
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

            const sample = getSample(dirname(samplePath), true);

            if (
                sample.details?.requiresManualTesting ||
                sample.details?.skipTest
            ) {
                // eslint-disable-next-line playwright/no-skipped-test
                test.skip();
            }

            if (!page) {
                throw new Error('Page not initialized');
            }

            await page.evaluate(body => {
                window.HCVisualSetup?.beforeSample();

                const testContainer = document.querySelector('div[data-test-container]');
                testContainer.innerHTML = body;
            }, sample.html ?? defaultPageContent);

            if (sample.css) {
                const styleHandle = await page.addStyleTag({
                    content: sample.css
                });

                await styleHandle.evaluate(
                    (el: HTMLStyleElement) => el.id = 'visual-test-styles'
                );
            }

            await setTestingOptions(page);

            await page.evaluate(() => {
                window.HCVisualSetup?.markOptionsClean();

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

            // Load script with timeout handling
            const scriptHandle = await page.addScriptTag({
                content: transformVisualSampleScript(sample.script)
            });

            await page.evaluate(() => {
                if (window.Highcharts) {
                    const chart = Highcharts.charts[
                        Highcharts.charts.length - 1
                    ];

                    window.Highcharts.prepareShot(chart);
                }
            });


            let screenshotError: unknown;
            try {
                await expect(page).toHaveScreenshot();
            } catch (err) {
                screenshotError = err;
            } finally {
                if (scriptHandle) {
                    await scriptHandle.evaluate(
                        (element: HTMLScriptElement) => {
                            element.id = 'visual-test-script';
                        }
                    );
                }
            }

            if (screenshotError) {
                throw screenshotError;
            }
        });
    }
});
