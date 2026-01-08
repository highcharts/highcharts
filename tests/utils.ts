/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { JSHandle, Page } from '@playwright/test';

import { join, extname, normalize } from 'node:path';
import { globSync } from 'glob';
import { load as yamlLoad } from 'js-yaml';
import { existsSync, readFileSync } from 'node:fs';

export async function setTestingOptions(
    page: Page, HC: JSHandle<typeof Highcharts> | undefined = undefined
){
    await page.evaluate(({ HC }) => {
        (HC ?? window.Highcharts as any).setOptions({
            chart: {
                animation: false
            },
            lang: {
                locale: 'en-GB'
            },
            plotOptions: {
                series: {
                    animation: false,
                    dataLabels: {
                        defer: false
                    },
                    states: {
                        hover: {
                            animation: false
                        },
                        select: {
                            animation: false
                        },
                        inactive: {
                            animation: false
                        },
                        normal: {
                            animation: false
                        }
                    },
                    label: {
                        // Disable it to avoid diff. Consider enabling it in the future,
                        // then it can be enabled in the clean-up commit right after a
                        // release.
                        enabled: false
                    }
                },
                // We cannot use it in plotOptions.series because treemap
                // has the same layout option: layoutAlgorithm.
                networkgraph: {
                    layoutAlgorithm: {
                        enableSimulation: false,
                        maxIterations: 10
                    }
                },
                packedbubble: {
                    layoutAlgorithm: {
                        enableSimulation: false,
                        maxIterations: 10
                    }
                }

            },
            // Stock's Toolbar decreases width of the chart. At the same time, some
            // tests have hardcoded x/y positions for events which cuases them to fail.
            // For these tests, let's disable stockTools.gui globally.
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            tooltip: {
                animation: false
            },
            drilldown: {
                animation: false
            }
        });
    }, { HC });


}

export async function getKarmaScripts() {
    const { default: files } = await import(
        '../test/karma-files.json',
        { with: { type: 'json'} }
    );

    return files;
}

type Details = {
    resources?: string[];
    requiresManualTesting?: boolean;
    skipTest?: boolean;
};

type SampleObj = {
    script?: string;
    css?: string;
    html?: string;
    details?: Details;
};

export const template = ({ script, css, html, details }: SampleObj) => `<html>
    <head>
        <style>
            ${css}
        </style>

        ${details?.resources && details.resources.some(r => r.includes('qunit')) ?
                '<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>' : ''
        }

        ${details?.resources && details.resources.map(r => {
            const extToHTML = {
                '.css': (url: string) => `<link rel="stylesheet" href="${url}">`,
                '.js': (url: string) => `<script src="${url}"></script>`
            };

            const fn = extToHTML[extname(r)];
            return fn ? fn(r) : '';
        }).join('')}

        <script>
        if(window.QUnit){
            // Fix the number localization in IE
            if (
                /msie/.test(navigator.userAgent) &&
                !Number.prototype._toString) {
                    Number.prototype._toString = Number.prototype.toString;
                    Number.prototype.toString = function (radix) {
                        if (radix) {
                            return Number.prototype._toString.apply(
                                this, arguments
                            );
                        } else {
                            return this.toLocaleString('en', {
                                useGrouping: false,
                                maximumFractionDigits: 20,
                            });
                        }
                    };
                }




                QUnit.assert.close = function (
                    number, expected, error, message
                ) {
                    // Remove fix of number localization in IE
                    if (
                        /msie/.test(navigator.userAgent) &&
                        Number.prototype._toString
                    ) {
                        Number.prototype.toString =
                            Number.prototype._toString;
                        delete Number.prototype._toString;
                    }

                    if (error === void 0 || error === null) {
                        error = 0.00001; // default error
                    }

                    const result = number === expected ||
                        (
                            number <= expected + error &&
                                number >= expected - error
                    ) ||
                        false;

                    this.pushResult({
                        result: result,
                        actual: number,
                        expected: expected,
                        message: message,
                    });
                };
        }
            </script>
    </head>
    <body>
        ${html}
        <script>
        ${script}
        </script>
    </body>
</html>`;



// TODO: stolen from karma-conf. Can likely rely on intercepts for some of these
function resolveJSON(js: string): { script: string;  } {
    const regex = /(?:(\$|Highcharts)\.getJSON|fetch)\([ \r\n]*'([^']+)/g;
    let match: RegExpExecArray | null;
    const codeblocks: string[] = [];

    while ((match = regex.exec(js)) !== null) {
        const src = match[2];
        let data: string | undefined;
        let localPath: string | undefined;

        // Look for sources that can be matched to samples/data
        const sampleMatch = src.match(
            // eslint-disable-next-line @stylistic/max-len
            /^(https:\/\/cdn\.jsdelivr\.net\/gh\/highcharts\/highcharts@[a-z0-9.]+|https:\/\/www\.highcharts\.com)\/samples\/data\/([a-z0-9\-.]+$)/
        ) || src.match(
            /^(https:\/\/demo-live-data\.highcharts\.com)\/([a-z0-9\-.]+$)/
        );

        if (sampleMatch) {
            const filename = sampleMatch[2];
            localPath = join('samples', 'data', filename);
            data = readFileSync(
                join(__dirname, '..', localPath),
                'utf8'
            );
        }

        // Look for sources that can be matched to the map collection
        const mapMatch = src.match(
            /^(https:\/\/code\.highcharts\.com\/mapdata\/([a-z/.-]+))$/
        );
        if (!data && mapMatch) {
            const filename = mapMatch[2];
            localPath = join('node_modules', '@highcharts', 'map-collection', filename);
            data = readFileSync(
                join(__dirname, '..', localPath),
                'utf8'
            );
        }

        if (data && localPath) {
            const normalizedPath = localPath.replace(/\\/g, '/');
            const extension = extname(normalizedPath);

            if (/json$/i.test(extension)) {
                codeblocks.push(`window.JSONSources['${src}'] = ${data};`);
            }
            if (/csv$/i.test(extension)) {
                codeblocks.push(`window.JSONSources['${src}'] = \`${data}\`;`);
            }
        }
    }

    codeblocks.push(js);

    return {
        script: codeblocks.join('\n')
    };
}
const highchartsCssPath = [
    join(__dirname, '..', 'code', 'css', 'highcharts.css'),
    join(__dirname, '..', 'css', 'highcharts.css')
].find(existsSync);

if (!highchartsCssPath) {
    throw new Error('Unable to locate highcharts.css for Playwright tests');
}

// Prefer the built CSS but fall back to the source file when dist assets are absent.
export const highchartsCSS = readFileSync(highchartsCssPath, 'utf8');

export function getSample(path: string, injectCSS: boolean = false) {
    path = normalize(path.replace(/\\/g, '/')).replace(/\\/g, '/');
    const files = {
        html: 'demo.html',
        css: 'demo.css',
        script: 'demo.{js,mjs,ts}',
        details: 'demo.details'
    };

    const obj: SampleObj = {};

    for (const [type, file] of Object.entries(files)) {
        try {
            const pattern = join(path, file).replace(/\\/g, '/');
            const [globPath] = globSync(pattern, { absolute: true });
            const content = readFileSync(globPath, { encoding: 'utf8'});

            obj[type] = type === 'details' ?
                yamlLoad(content) as object :
                content;

        } catch {/**/}
    }

    const resolvedScript = resolveJSON(obj.script ?? '');
    obj.script = resolvedScript.script;

    if ((injectCSS || path.includes('unit-tests')) && /styledMode:\s+true/.test(obj.script)) {
        // Inject css
        obj.script = `window.highchartsCSS = \`${highchartsCSS}\`;
${obj.script}`;
    }

    return obj;
}

/**
 * Options for waiting for chart resize completion.
 */
export interface WaitForResizeOptions {
    /** Maximum time to wait in milliseconds. Default: 5000 */
    timeout?: number;
}

/**
 * Waits until all Highcharts charts on the page have finished resizing.
 *
 * This function handles:
 * - Charts currently in the middle of a resize (isResizing > 0)
 * - Charts with pending reflows scheduled by ResizeObserver
 *
 * It uses a delay + polling approach:
 * 1. First waits 150ms to allow ResizeObserver callbacks to fire and schedule
 *    any pending reflows (which have a 100ms debounce)
 * 2. Then polls until all charts have isResizing === 0
 *
 * @param page - Playwright Page object
 * @param options - Configuration options
 * @returns Promise that resolves when all charts have finished resizing
 *
 * @example
 * ```ts
 * await page.setViewportSize({ width: 375, height: 667 });
 * await waitForChartsResizeComplete(page);
 * // Now safe to assert on chart state
 * ```
 */
export async function waitForChartsResizeComplete(
    page: Page,
    options: WaitForResizeOptions = {}
): Promise<void> {
    const { timeout = 5000 } = options;

    await page.evaluate((timeoutMs) => {
        return new Promise<void>((resolve, reject) => {
            const Highcharts = (window as any).Highcharts;
            if (!Highcharts) {
                resolve();
                return;
            }

            const charts = Highcharts.charts?.filter(Boolean) || [];
            if (charts.length === 0) {
                resolve();
                return;
            }

            let resolved = false;
            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    reject(new Error('Timeout waiting for charts to finish resizing'));
                }
            }, timeoutMs);

            const finish = (): void => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    resolve();
                }
            };

            // Check if all charts are done resizing (isResizing === 0)
            const allChartsIdle = (): boolean => {
                return charts.every((chart: any) => chart.isResizing === 0);
            };

            // Poll until all charts are idle
            const pollUntilIdle = (): void => {
                if (allChartsIdle()) {
                    finish();
                } else {
                    requestAnimationFrame(pollUntilIdle);
                }
            };

            // Wait for ResizeObserver debounce (100ms) plus a small buffer,
            // then start polling for isResizing === 0
            // This ensures any viewport-triggered reflows have started
            setTimeout(() => {
                pollUntilIdle();
            }, 150);
        });
    }, timeout);
}
