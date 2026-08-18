/* eslint-disable playwright/no-conditional-in-test */
import type { Page, BrowserContext } from '@playwright/test';
import { test } from '@playwright/test';
import { setupRoutes } from '~/fixtures.ts';
import {
    getKarmaScripts,
    getSample,
    setTestingOptions,
    transpileTS
} from '~/utils.ts';
import { join, dirname, relative } from 'node:path';
import { glob } from 'glob';
import { GIFEncoder, applyPalette, quantize } from 'gifenc';
import {
    appendError,
    readReference,
    recordCandidateResult,
    writeCandidateCompletion,
    writeReference
} from './visual-results.ts';

type VisualComparator = {
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    compare: (data1: Uint8ClampedArray, data2: Uint8ClampedArray) => number;
    createCanvas: (id: string) => HTMLCanvasElement;
    getSVG: (chart: unknown) => string | undefined;
    svgToPixels: (
        svg: string,
        canvas: HTMLCanvasElement
    ) => Promise<Uint8ClampedArray>;
};

type BrowserRuntimeError = {
    message: string;
    stack?: string;
};

type VisualWindow = Window & {
    VisualComparator?: VisualComparator;
    visualTestUnhandledRejection?: BrowserRuntimeError;
    visualTestUnhandledRejectionListener?: (
        event: PromiseRejectionEvent
    ) => void;
};

type ComparisonResult = {
    candidatePixels?: number[];
    difference: number;
    height: number;
    referencePixels?: number[];
    width: number;
};

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

function throwRuntimeError(
    runtimeError: BrowserRuntimeError | undefined
): void {
    if (runtimeError) {
        throw new Error(
            `${runtimeError.message}${
                runtimeError.stack ?
                    `\n${runtimeError.stack}` :
                    ''
            }`
        );
    }
}

const FIXED_CLOCK_TIME = '2024-01-01T00:00:00.000Z';
const MAX_CHART_LOAD_ATTEMPTS = 100;
const CHART_LOAD_RETRY_DELAY_MS = 100;
const CHART_LOAD_TIMEOUT_MS =
    MAX_CHART_LOAD_ATTEMPTS * CHART_LOAD_RETRY_DELAY_MS;
const root = process.cwd();
const referenceMode = process.env.VISUAL_TEST_REFERENCE === '1';
const runtimeErrorMode = process.env.VISUAL_TEST_RUNTIME_ERROR;

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

function createAnimatedGif(
    referencePixels: Uint8Array,
    candidatePixels: Uint8Array,
    width: number,
    height: number
): Uint8Array {
    const palette = quantize(referencePixels, 256);
    const gif = GIFEncoder();

    [referencePixels, candidatePixels].forEach(frame => {
        gif.writeFrame(applyPalette(frame, palette), width, height, {
            palette,
            delay: 500
        });
    });
    gif.finish();

    return gif.bytes();
}

test.describe('Visual tests', () => {
    test.describe.configure({
        timeout: 5_000,
    });

    let page: Page | undefined;
    let context: BrowserContext | undefined;
    let initialized = false;

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
            join('test', 'visual-comparator.js'),
            join('tests', 'visual', 'visual-setup.js')
        ];

        for (const script of scripts) {
            await page.addScriptTag({
                path: script
            });
        }

        await page.waitForFunction(
            () => window.HCVisualSetup?.initialized === true &&
                !!(window as VisualWindow).VisualComparator
        );
        await page.evaluate(() => {
            window.HCVisualSetup?.configure({ mode: 'fast' });
            window.HCVisualSetup?.markOptionsClean();
        });
        initialized = true;
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
        if (!referenceMode && initialized) {
            writeCandidateCompletion(root);
        }
    });

    const pathEnv = process.env.VISUAL_TEST_PATH ?? '';
    const pathFilters = pathEnv
        .split(/[,;\n]/)
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => value.replace(/\\/g, '/'));

    const samples = glob.sync(['samples/**/demo.{js,mjs,ts}'], {
        ignore: [
            'samples/unit-tests/**',
            'samples/issues/**',
            'samples/mapdata/**',
            // --- VISUAL TESTS ---

            // Custom data source
            'samples/highcharts/blog/annotations-aapl-iphone/demo.{js,mjs,ts}',
            'samples/highcharts/blog/gdp-growth-annual/demo.{js,mjs,ts}',
            'samples/highcharts/blog/gdp-growth-multiple-request-v2/demo.{js,mjs,ts}',
            'samples/highcharts/blog/gdp-growth-multiple-request/demo.{js,mjs,ts}',
            'samples/highcharts/website/xmas-2021/demo.{js,mjs,ts}',

            // Error #13, renders to other divs than #container. Sets global
            // options.
            'samples/highcharts/demo/bullet-graph/demo.{js,mjs,ts}',
            // Network loading?
            'samples/highcharts/demo/combo-meteogram/demo.{js,mjs,ts}',

            // CSV data, parser fails - why??
            'samples/highcharts/demo/line-csv/demo.{js,mjs,ts}',

            // Clock
            'samples/highcharts/demo/dynamic-update/demo.{js,mjs,ts}',
            'samples/highcharts/demo/gauge-vu-meter/demo.{js,mjs,ts}',

            // Too heavy
            'samples/highcharts/demo/parallel-coordinates/demo.{js,mjs,ts}',
            'samples/highcharts/demo/sparkline/demo.{js,mjs,ts}',

            // Maps
            'samples/maps/demo/map-pies/demo.{js,mjs,ts}', // advanced data
            'samples/maps/demo/us-counties/demo.{js,mjs,ts}', // advanced data
            'samples/maps/plotoptions/series-animation-true/demo.{js,mjs,ts}', // animation
            'samples/highcharts/blog/map-europe-electricity-price/demo.{js,mjs,ts}', // strange fails, remove this later

            // Unknown error
            'samples/highcharts/boost/arearange/demo.{js,mjs,ts}',
            'samples/highcharts/boost/scatter-smaller/demo.{js,mjs,ts}',
            'samples/highcharts/data/google-spreadsheet/demo.{js,mjs,ts}',

            // Various
            'samples/highcharts/data/delimiters/demo.{js,mjs,ts}', // data island
            'samples/highcharts/css/exporting/demo.{js,mjs,ts}', // advanced demo
            'samples/highcharts/css/pattern/demo.{js,mjs,ts}', // styled mode, setOptions
            'samples/highcharts/studies/logistics/demo.{js,mjs,ts}', // overriding

            // Failing on Edge only
            'samples/unit-tests/pointer/members/demo.{js,mjs,ts}',

            // visual tests excluded for now due to failure
            'samples/highcharts/demo/funnel3d/demo.{js,mjs,ts}',
            'samples/highcharts/demo/live-data/demo.{js,mjs,ts}',
            'samples/highcharts/demo/organization-chart/demo.{js,mjs,ts}',
            'samples/highcharts/demo/pareto/demo.{js,mjs,ts}',
            'samples/highcharts/demo/pyramid3d/demo.{js,mjs,ts}',
            'samples/highcharts/demo/synchronized-charts/demo.{js,mjs,ts}',

            // Visual test fails due to external library used
            'samples/highcharts/demo/combo-regression/demo.{js,mjs,ts}',

            'samples/grid-pro/**/demo.{js,mjs,ts}', // TODO: Fails as Grid is not defined
            'samples/grid-lite/**/demo.{js,mjs,ts}', // TODO: Fails as Grid is not defined
            'samples/dashboards/**/demo.{js,mjs,ts}' // TODO: Fails as Grid is not defined
        ],
        absolute: true,
        posix: true,
        nodir: true,
        follow: false,
        windowsPathsNoEscape: true
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
            const visualSamplePath = relative(
                join(root, 'samples'),
                dirname(samplePath)
            ).replace(/\\/g, '/');
            if (context) {
                await context.clock.setFixedTime(FIXED_CLOCK_TIME);
            }

            const sample = getSample(dirname(samplePath), true);
            if (sample.script && samplePath.endsWith('.ts')) {
                sample.script = transpileTS(sample.script);
            }

            if (
                sample.details?.requiresManualTesting ||
                sample.details?.skipTest
            ) {
                // eslint-disable-next-line playwright/no-skipped-test
                test.skip();
            }

            let scriptHandle: Awaited<ReturnType<Page['addScriptTag']>> | undefined;
            let pageError: BrowserRuntimeError | undefined;
            const pageErrorListener = (error: Error): void => {
                if (!pageError) {
                    pageError = {
                        message: error.message,
                        stack: error.stack
                    };
                }
            };
            try {
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
                }
                if (sample.css) {
                    // Use the styled mode ID for SVG injection.
                    const styleHandle = await page.addStyleTag({
                        content: sample.css
                    });
                    await styleHandle.evaluate(
                        (el: HTMLStyleElement, id: string) => el.id = id,
                        isStyledMode ? 'demo.css' : 'visual-test-styles'
                    );
                }

                // Load script with timeout handling
                page.on('pageerror', pageErrorListener);
                await page.evaluate(() => {
                    const visualWindow = window as VisualWindow;
                    const listener = (event: PromiseRejectionEvent): void => {
                        if (visualWindow.visualTestUnhandledRejection) {
                            return;
                        }

                        const reason = event.reason;
                        visualWindow.visualTestUnhandledRejection =
                            reason instanceof Error ? {
                                message: reason.message,
                                stack: reason.stack
                            } : {
                                message: String(reason)
                            };
                    };
                    visualWindow.visualTestUnhandledRejectionListener =
                        listener;
                    window.addEventListener(
                        'unhandledrejection',
                        listener
                    );
                });
                scriptHandle = await page.addScriptTag({
                    content: transformedScript
                });

                if (runtimeErrorMode === 'pageerror') {
                    const controlledPageError = page.waitForEvent('pageerror', {
                        predicate: error =>
                            error.message === 'Controlled visual pageerror'
                    });
                    await page.evaluate(() => {
                        queueMicrotask(() => {
                            throw new Error('Controlled visual pageerror');
                        });
                    });
                    await controlledPageError;
                } else if (runtimeErrorMode === 'unhandledrejection') {
                    await page.evaluate(() => {
                        const promise = Promise.resolve();
                        window.dispatchEvent(
                            new PromiseRejectionEvent('unhandledrejection', {
                                promise,
                                reason: new Error(
                                    'Controlled visual unhandledrejection'
                                )
                            })
                        );
                    });
                    await page.waitForFunction(
                        () => !!(window as VisualWindow)
                            .visualTestUnhandledRejection
                    );
                }

                const candidateSVG = await page.evaluate(
                    async ({ maxAttempts, retryDelay, timeoutMs }) => {
                        const Highcharts = (window as any).Highcharts;
                        const comparator =
                            (window as VisualWindow).VisualComparator;

                        if (!comparator) {
                            throw new Error('Visual comparator is not loaded.');
                        }

                        let attempts = 0;
                        while (attempts < maxAttempts) {
                            const chart = Highcharts?.charts?.at(-1);

                            if (chart || document.getElementsByTagName('svg').length) {
                                const validCharts = Highcharts?.charts?.filter(
                                    (c: any) => c &&
                                        c.container &&
                                        !c.renderer?.forExport
                                ) || [];
                                const svg = comparator.getSVG(validCharts[0]);

                                if (!svg) {
                                    throw new Error('No candidate SVG found.');
                                }

                                return svg;
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

                if (referenceMode) {
                    const runtimeError = pageError ?? await page.evaluate(() =>
                        (window as VisualWindow)
                            .visualTestUnhandledRejection
                    );
                    throwRuntimeError(runtimeError);
                    writeReference(root, visualSamplePath, candidateSVG);
                } else {
                    const referenceSVG = readReference(root, visualSamplePath);
                    const comparison = await page.evaluate(
                        async (
                            { candidateSVG, referenceSVG }
                        ): Promise<ComparisonResult> => {
                            const comparator =
                                (window as VisualWindow).VisualComparator;

                            if (!comparator) {
                                throw new Error('Visual comparator is not loaded.');
                            }

                            const pixels = await Promise.all([
                                comparator.svgToPixels(
                                    referenceSVG,
                                    comparator.createCanvas('reference')
                                ),
                                comparator.svgToPixels(
                                    candidateSVG,
                                    comparator.createCanvas('candidate')
                                )
                            ]);
                            const difference = comparator.compare(
                                pixels[0],
                                pixels[1]
                            );

                            return {
                                difference,
                                width: comparator.CANVAS_WIDTH,
                                height: comparator.CANVAS_HEIGHT,
                                ...(difference ? {
                                    referencePixels: Array.from(pixels[0]),
                                    candidatePixels: Array.from(pixels[1])
                                } : {})
                            };
                        },
                        { candidateSVG, referenceSVG }
                    );

                    const runtimeError = pageError ?? await page.evaluate(() =>
                        (window as VisualWindow)
                            .visualTestUnhandledRejection
                    );
                    throwRuntimeError(runtimeError);

                    if (comparison.difference) {
                        if (
                            !comparison.referencePixels ||
                            !comparison.candidatePixels
                        ) {
                            throw new Error('Missing pixels for visual diff GIF.');
                        }

                        recordCandidateResult(
                            root,
                            visualSamplePath,
                            comparison.difference,
                            candidateSVG,
                            createAnimatedGif(
                                Uint8Array.from(comparison.referencePixels),
                                Uint8Array.from(comparison.candidatePixels),
                                comparison.width,
                                comparison.height
                            )
                        );
                    } else {
                        recordCandidateResult(root, visualSamplePath, 0);
                    }
                }
            } catch (error) {
                appendError(
                    root,
                    `Visual test failed for ${visualSamplePath}: ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
                throw error;
            } finally {
                if (page) {
                    page.off('pageerror', pageErrorListener);
                    await page.evaluate(() => {
                        const visualWindow = window as VisualWindow;
                        const listener =
                            visualWindow.visualTestUnhandledRejectionListener;
                        if (listener) {
                            window.removeEventListener(
                                'unhandledrejection',
                                listener
                            );
                        }
                        delete visualWindow.visualTestUnhandledRejection;
                        delete visualWindow
                            .visualTestUnhandledRejectionListener;
                    });
                }
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
