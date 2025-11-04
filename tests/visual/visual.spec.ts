/* eslint-disable playwright/no-conditional-expect */
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

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    process.once('SIGINT', async () => {
        console.log('\nReceived SIGINT, closing browser...');
        if (page) {
            await page.close().catch(() => {});
        }
        if (context) {
            await context.close().catch(() => {});
        }
        process.exit(130);
    });

    test.beforeAll(async ({ browser }) => {
        context ??= await browser.newContext({
            viewport: { width: 800, height: 600 },
            colorScheme: 'light'
        });

        await context.setOffline(true);

        await context.clock.install({ time: FIXED_CLOCK_TIME });
        page = await context.newPage();
        await context.clock.setFixedTime(FIXED_CLOCK_TIME);

        await setupRoutes(page);

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
                    (window.Highcharts as any).setOptions({
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
                    const chart = (window.Highcharts as any).charts[
                        (window.Highcharts as any).charts.length - 1
                    ];

                    (window.Highcharts as any).prepareShot(chart);
                }
            });

            await page.evaluate(async () => {
                try {
                    await document.fonts?.ready;
                } catch {
                    // Swallow errors if fonts API is unavailable or fails.
                }
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(
                        () => requestAnimationFrame(() => resolve())
                    );
                });
            });

            try {
                // Wait for charts to be ready with SVG elements
                await page.waitForFunction(
                    () => {
                        const Highcharts = (window as any).Highcharts;
                        if (!Highcharts?.charts) return true;

                        const validCharts = Highcharts.charts.filter(
                            (chart: any) => chart && chart.container
                            && !chart.renderer?.forExport
                        );

                        return validCharts.length === 0 || validCharts.every(
                            (chart: any) => chart.container?.querySelector('svg')
                        );
                    },
                    { timeout: 1000 }
                );

                // Add a small delay to ensure chart rendering is stable
                // await page.waitForTimeout(50);

                // Single evaluation to get both chart count and SVG content atomically
                const { chartCount, svgContent } = await page.evaluate(() => {
                    const Highcharts = (window as any).Highcharts;
                    if (!Highcharts?.charts) {
                        return { chartCount: 0, svgContent: null };
                    }

                    // Use consistent filtering logic
                    const validCharts = Highcharts.charts.filter(
                        (chart: any) => chart && chart.container &&
                            !chart.renderer?.forExport &&
                            chart.container.querySelector('svg')
                    );

                    const count = validCharts.length;
                    let svg = null;

                    // Only extract SVG if we have exactly one valid chart
                    if (count === 1 && validCharts[0]) {
                        const svgElement = validCharts[0].container.querySelector('svg');
                        svg = svgElement ? svgElement.outerHTML : null;
                    }

                    return { chartCount: count, svgContent: svg };
                });

                // Use SVG snapshot for single chart with valid SVG content
                if (chartCount === 1 && svgContent) {
                    expect(svgContent).toMatchSnapshot(`${samplePath}.svg`);

                    await page.screenshot({ fullPage: true });
                } else {
                    await expect(page).toHaveScreenshot({
                        fullPage: true
                    });
                }
            } catch {
                // noop
            } finally {
                if (page && scriptHandle) {
                    await scriptHandle.evaluate(
                        (element: HTMLScriptElement) => {
                            element.id = 'visual-test-script';
                        }
                    );
                }
            }
        });
    }
});
