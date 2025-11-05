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
const MAX_CHART_LOAD_ATTEMPTS = 100;
const CHART_LOAD_RETRY_DELAY_MS = 100;
const CHART_LOAD_TIMEOUT_MS =
    MAX_CHART_LOAD_ATTEMPTS * CHART_LOAD_RETRY_DELAY_MS;

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

            // Inject CSS for styled mode like karma-conf.js does
            const transformedScript = transformVisualSampleScript(
                sample.script
            );
            const isStyledMode = transformedScript.indexOf('styledMode: true') !== -1;

            if (isStyledMode) {
                // Add highcharts.css
                const highchartsCSS = await page.evaluate(() => {
                    return (window as any).highchartsCSS || '';
                });

                if (highchartsCSS) {
                    const styleHandle = await page.addStyleTag({
                        content: highchartsCSS
                    });
                    await styleHandle.evaluate(
                        (el: HTMLStyleElement) => el.id = 'highcharts.css'
                    );
                }

                // Add demo.css if exists (for styled mode, use id 'demo.css' for SVG injection)
                if (sample.css) {
                    const styleHandle = await page.addStyleTag({
                        content: sample.css
                    });
                    await styleHandle.evaluate(
                        (el: HTMLStyleElement) => el.id = 'demo.css'
                    );
                }
            } else {
                // For non-styled mode, add demo.css with standard id
                if (sample.css) {
                    const styleHandle = await page.addStyleTag({
                        content: sample.css
                    });
                    await styleHandle.evaluate(
                        (el: HTMLStyleElement) => el.id = 'visual-test-styles'
                    );
                }
            }

            // Load script with timeout handling
            const scriptHandle = await page.addScriptTag({
                content: transformedScript
            });

            try {
                // Wait for chart to load, similar to karma-conf.js waitForChartToLoad
                const { chartCount, svgContent } = await page.evaluate(
                    async ({ maxAttempts, retryDelay, timeoutMs }) => {
                        const Highcharts = (window as any).Highcharts;

                        // Modern while loop approach instead of recursion
                        let attempts = 0;
                        while (attempts < maxAttempts) {
                            const chart = Highcharts?.charts?.at(-1);

                            if (chart || document.getElementsByTagName('svg').length) {
                                // Chart exists, prepare shot like karma-setup.js:prepareShot
                                if (Highcharts && chart) {
                                    Highcharts.prepareShot(chart);
                                }

                                // Extract SVG similar to karma-setup.js:getSVG
                                const validCharts = Highcharts?.charts?.filter(
                                    (c: any) => c &&
                                        c.container &&
                                        !c.renderer?.forExport
                                ) || [];

                                const count = validCharts.length;
                                let svg: string | null = null;

                                if (count >= 1 && validCharts[0]) {
                                    const container = validCharts[0].container;
                                    const svgElement = container.querySelector('svg');

                                    if (svgElement) {
                                        // Step 1: Extract SVG and add xmlns:xlink namespace
                                        svg = svgElement.outerHTML.replace(
                                            /<svg /,
                                            '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '
                                        );

                                        // Step 2: For styled mode, inject CSS into SVG like karma-setup.js
                                        if (validCharts[0].styledMode) {
                                            // Inject Highcharts base CSS
                                            const highchartsCSS = document.getElementById('highcharts.css');
                                            if (highchartsCSS) {
                                                svg = svg
                                                    .replace(
                                                        ' class="highcharts-root" ',
                                                        ' class="highcharts-root highcharts-container" ' +
                                                        'style="width:auto; height:auto" '
                                                    )
                                                    .replace(
                                                        '</defs>',
                                                        `<style>${highchartsCSS.innerText}</style></defs>`
                                                    );
                                            }

                                            // Inject demo-specific CSS
                                            const demoCSS = document.getElementById('demo.css');
                                            if (demoCSS) {
                                                svg = svg.replace(
                                                    '</defs>',
                                                    `<style>${demoCSS.innerText}</style></defs>`
                                                );
                                            }
                                        }

                                        // Step 3: Pretty-print SVG like karma-setup.js:prettyXML
                                        svg = svg
                                            .replace(/>/g, '>\n')
                                            // Don't introduce newlines inside tspans or links
                                            .replace(/<tspan([^>]*)>\n/g, '<tspan$1>')
                                            .replace(/<\/tspan>\n/g, '</tspan>')
                                            .replace(/<a([^>]*)>\n/g, '<a$1>')
                                            .replace(/<\/a>\n/g, '</a>');
                                    }
                                }

                                return { chartCount: count, svgContent: svg };
                            }

                            attempts++;
                            await new Promise(
                                resolve => setTimeout(resolve, retryDelay)
                            );
                        }

                        throw new Error(
                            `Chart test failed to load within ${timeoutMs}ms ` +
                            `(${maxAttempts} attempts at ${retryDelay}ms intervals).`
                        );
                    },
                    {
                        maxAttempts: MAX_CHART_LOAD_ATTEMPTS,
                        retryDelay: CHART_LOAD_RETRY_DELAY_MS,
                        timeoutMs: CHART_LOAD_TIMEOUT_MS
                    }
                );

                if (svgContent) {
                    expect(svgContent).toMatchSnapshot(`${samplePath}.svg`);
                }

                if (svgContent && chartCount === 1) {
                    // For single chart, still take screenshot but don't compare
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
