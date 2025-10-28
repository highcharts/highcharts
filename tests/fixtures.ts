/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type {
    Route,
    Request,
    Page,
    JSHandle,
    ElementHandle,
} from '@playwright/test';

import type Highcharts from '../code/esm/highcharts.src';

import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path/posix';

import { test as base } from '@playwright/test';
import { getKarmaScripts, setTestingOptions } from './utils';

const contentTypes: Record<string, string> = {
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.csv': 'text/csv',
    '.svg': 'image/svg+xml'
};

async function replaceHCCode(route: Route) {
    const url = route.request().url();
    let relativePath = url.split('/code.highcharts.com/')[1]
        .replace(/^(stock|maps|gantt|grid)\//u, '');

    if (relativePath.endsWith('.js') && !relativePath.endsWith('.src.js')) {
        relativePath = relativePath.replace('.js', '.src.js');
    }

    let rootPath = 'code';

    if (relativePath.includes('gfx')) {
        rootPath = '';
        const { preceding } =
            relativePath.match(/(?<preceding>^.+)\/gfx/).groups;

        relativePath = relativePath.replace(preceding, '');
    }

    const localPath = join(
        __dirname,
        '..',
        rootPath,
        relativePath
    );

    test.info().annotations.push({
        type: 'redirect',
        description: `${url} --> ${join('code', relativePath)}`
    });

    try {
        const body = await readFile(localPath);
        await route.fulfill({
            status: 200,
            body,
            contentType: contentTypes[extname(localPath)]
        });
    } catch {
        await route.abort();
        throw new Error(`Missing local file for ${relativePath}`);
    }
}

type RouteType = {
    pattern: string | RegExp | ((url: URL) => boolean);
    handler: (route: Route, request: Request) => Promise<void>;
};

async function getJSONSources(): Promise<RouteType[]> {
    const routes: RouteType[] = [];
    const { default: sources } = await import(
        '../samples/data/json-sources/index.json',
        { with: { type: 'json' } }
    );

    for (const source of sources as {url: string, filename: string}[]) {
        routes.push({
            pattern: source.url,
            handler: async route => {
                try {
                    const localPath = join(
                        'samples/data/json-sources',
                        source.filename
                    );

                    const body = await readFile(join(__dirname, '../', localPath));

                    test.info().annotations.push({
                        type: 'redirect',
                        description: `${source.url} --> ${localPath}`
                    });

                    await route.fulfill({
                        status: 200,
                        body,
                        contentType: contentTypes[extname(source.filename)]
                    });
                } catch {
                    await route.abort();
                    throw new Error(`Unable to resolve local JSON source for ${source.url}`);
                }
            }
        });
    }

    routes.push({
        // From typescript-karma/karma-fetch.js
        pattern: '**/data/sine-data.csv',
        handler: (route: Route) => {
            const csv = [['X', 'sin(n)', 'sin(-n)']];

            for (let i = 0, iEnd = 10, x: number; i < iEnd; ++i) {
                x = 3184606 + Math.random();
                csv.push([
                    x.toString(),
                    Math.sin(x).toString(),
                    Math.sin(-x).toString()
                ]);
            }

            return route.fulfill({
                body: csv.map(line => line.join(',')).join('\n'),
                contentType: contentTypes.csv
            });
        }
    });

    return routes;
}

async function replaceMapData(route: Route) {
    const url = route.request().url();
    const match = url.match(/mapdata\/(.+\.*)/u);

    if (match?.length) {
        const filename = match[1];
        try {
            const mapPath = join('@highcharts/map-collection', filename);
            const filePath = require.resolve(mapPath);
            const data = await readFile(filePath, 'utf8');

            test.info().annotations.push({
                type: 'redirect',
                description: `${url} --> node_modules/${mapPath}`
            });

            return route.fulfill({
                status: 200,
                contentType: contentTypes[extname(filename)] ?? 'text/plain',
                body: data
            });
        } catch (error) {
            console.error(error);
        }
    }

    await route.abort();
    throw new Error('Failed to find a matching map data');
}

export async function replaceSampleData(route: Route) {
    const requestUrl = route.request().url();

    try {
        const parsed = new URL(requestUrl);
        let relativePath: string | undefined;

        if (parsed.hostname === 'demo-live-data.highcharts.com') {
            relativePath = parsed.pathname.replace(/^\/+/, '');
        } else {
            const match = parsed.pathname.match(/samples\/data\/(.+)/);
            if (match) {
                relativePath = match[1];
            }
        }

        if (relativePath) {
            const normalized = decodeURIComponent(
                relativePath.replace(/^\/+/, '')
            );
            const samplePath = join('samples/data', normalized);
            const filePath = join(__dirname, '..', samplePath);
            const data = await readFile(filePath, 'utf8');

            test.info().annotations.push({
                type: 'redirect',
                description: `${requestUrl} --> ${samplePath}`
            });

            await route.fulfill({
                status: 200,
                contentType: contentTypes[extname(normalized)] ?? 'text/plain',
                body: data
            });
            return;
        }
    } catch (error) {
        console.error(error);
    }

    await route.abort();
    throw new Error('Failed to find a matching dataset');
}

export async function setupRoutes(page: Page){
    if (!process.env.NO_REWRITES) {
        const routes: RouteType[] = [
            {
                pattern: '**/code.highcharts.com/**',
                handler: replaceHCCode
            },
            {
                pattern: 'https://code.jquery.com/qunit/**',
                handler: async (route) => {
                    const url = new URL(route.request().url());
                    const filename = url.pathname.split('/').pop();

                    if (!filename) {
                        await route.abort();
                        throw new Error('Invalid QUnit asset request');
                    }

                    const localPath = join('tests', 'qunit', 'vendor', filename);

                    try {
                        await route.fulfill({
                            path: localPath,
                            contentType: contentTypes[extname(filename)] ??
                                'application/octet-stream'
                        });

                        test.info().annotations.push({
                            type: 'redirect',
                            description: `${url} --> ${localPath}`
                        });
                    } catch {
                        await route.abort();
                        throw new Error(`Missing local QUnit asset for ${filename}`);
                    }
                }
            },
            {
                pattern: '**/**/{samples/data}/**',
                handler: replaceSampleData
            },
            {
                pattern: 'https://demo-live-data.highcharts.com/**',
                handler: replaceSampleData
            },
            {
                pattern: 'https://fonts.googleapis.com/**',
                handler: async (route) => {
                    const url = route.request().url();

                    test.info().annotations.push({
                        type: 'redirect',
                        description: `${url} --> (empty stylesheet)`
                    });

                    await route.fulfill({
                        status: 200,
                        contentType: contentTypes['.css'],
                        body: ''
                    });
                }
            },
            {
                pattern: '**/font-awesome/**',
                handler: async (route) => {
                    const url = route.request().url();

                    test.info().annotations.push({
                        type: 'redirect',
                        description: `${url} --> (empty stylesheet)`
                    });

                    await route.fulfill({
                        status: 200,
                        contentType: contentTypes['.css'],
                        body: ''
                    });
                }
            },
            {
                pattern: '**/**/mapdata/**',
                handler: replaceMapData
            },
            {
                pattern: '**/**/{samples/graphics}/**',
                handler: async (route) => {
                    const url = new URL(route.request().url());
                    const relativePath = url.pathname.split('/samples/graphics/')[1];
                    const filePath = join('samples/graphics', relativePath);

                    test.info().annotations.push({
                        type: 'redirect',
                        description: `${url} --> ${relativePath}`
                    });

                    await route.fulfill({
                        path: filePath,
                    });
                }
            },
            {
                pattern: '**/testimage.png',
                handler(route) {
                    return route.fulfill({
                        path: 'test/testimage.png',  // serve this file instead
                        contentType: 'image/png'
                    });
                },
            },
            ...(await getJSONSources()),
            {
                pattern:  '**/shim.html',
                handler: (route) =>
                    route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: '<!DOCTYPE html><html><head></head><body></body></html>'
                    })

            }
        ];

        for (const route of routes) {
            await page.route(route.pattern, route.handler);
        }
    }
}


export const test = base.extend({
    page: async ({ page }, use) => {
        await setupRoutes(page);
        await use(page);
    }
});

export type CreateChartConfig = {
    /**
     * The chart container. Can be a string or an `ElementHandle`
     * If a string is given, the container will be created.
     *
     * @defaultValue `'container'`
     *
     * @example
     * Providing an element:
     * ```ts
     *   await page.setContent('<div class="test">Test</div>');
     *
     *   const chart = await createChart(
     *       page,
     *       {},
     *       {
     *           container: await page.locator('.test').elementHandle()
     *       }
     *   );
     * ```
     */
    container: string | ElementHandle<HTMLElement | SVGElement>;
    /**
     * Highcharts modules to load.
     * Only compatible with Highcharts loaded via `<script>`.
     *
     * @remarks
     *
     * @example
     * Loading the accessibility module:
     * ```js
     * ['modules/accessibility.js']
     * ```
     */
    modules: string[];
    /**
     * The method called when creating the chart, i.e. `Highcharts.stockChart`.
     * @defaultValue `'chart'`
     */
    chartConstructor: 'chart' | 'stockChart' | 'ganttChart' | 'mapChart';
    /**
     * A custom Highcharts instance to use. If not provided, the
     * Highcharts bundle will be determined from the `chartConstructor` option
     * and loaded as a classic script.
     *
     * @example
     * Setting up a chart using esm modules:
     * ```ts
     * const HC = await page.evaluateHandle<typeof Highcharts>(async () => {
     *    await import('https://code.highcharts.com/esm/modules/stock-tools.src.js');
     *    return (await import('https://code.highcharts.com/esm/indicators/indicators-all.src.js')).default;
     * });
     *
     * const chart = await createChart(page, {}, { HC });
     * ```
     */
    HC: JSHandle<typeof Highcharts> | undefined,
    /**
     * CSS to append to the HTML body.
     */
    css: string;
    /**
     *  Whether to apply global Highcharts options that disables animations and
     *  certain features.
     *
     *  @defaultValue `true`
     */
    applyTestOptions: boolean;
    /**
     *  If enabled, loads all scripts in karma-files.json
     *
     *  @defaultValue `false`
     */
    emulateKarma: boolean;

    /**
     * A callback function that is passed to the [chart constructor](https://api.highcharts.com/class-reference/Highcharts.Chart#Chart)
     * callback parameter.
     *
     * Note that as this function is stringified and then recreated in the
     * browser context, accessing variables outside the scope of the function
     * scope, the document, or the `chart` parameter is not possible.
     *
     * @defaultValue `undefined`
     */
    chartCallback?: (chart: Highcharts.Chart) => void;
};

const defaultCreateChartConfig: CreateChartConfig = {
    container: 'container',
    modules: [],
    chartConstructor: 'chart',
    HC: undefined,
    css: '',
    applyTestOptions: true,
    emulateKarma: false,
    chartCallback: undefined
};

export function chartTemplate({
    container,
    modules,
    chartConstructor,
    HC,
    css,
    emulateKarma
}: CreateChartConfig): string {
    const constructorToModule: Record<CreateChartConfig['chartConstructor'], string> = {
        'chart': 'highcharts.src.js',
        'stockChart': 'stock/highstock.src.js',
        'ganttChart': 'gantt/highcharts-gantt.src.js',
        'mapChart': 'maps/highmaps.src.js'
    };

    const isIdContainer =  !!(typeof container === 'string');

    const moduleSet = new Set<string>([
        HC || emulateKarma ?  undefined : constructorToModule[chartConstructor],
        ...modules
    ]);

    const scriptString = Array.from(moduleSet)
        .map((m: string) => {
            if(!m) return '';

            const url = new URL(m, 'https://code.highcharts.com');
            return `<script src="${url.href}"></script>`;
        })
        .join('\n');

    return `<!DOCTYPE html>
<html>
    <head>
        ${scriptString}
        <style>
            ${css}
        </style
    </head>
    <body>
        ${isIdContainer ? `<div id="${container}"></div>` : ''}
    </body>
</html>`;
}

export async function createChart(
    page: Page,
    chartConfig: Partial<Highcharts.Options>,
    createChartConfig?: Partial<CreateChartConfig>
): Promise<JSHandle<ReturnType<typeof Highcharts.chart>>> {
    const ccc: CreateChartConfig = {
        ...defaultCreateChartConfig,
        ...createChartConfig
    };

    if (ccc.modules.length && ccc.HC) {
        throw new Error('Combining `modules` and `HC` option is not allowed (yet)');
    }

    if (
        ccc.emulateKarma &&
        !test.info().annotations.find(a => a.type === 'emulateKarma')
    ) {
        for (const script of await getKarmaScripts()) {
            await page.addScriptTag({
                path: script
            });
        }

        test.info().annotations.push({ type: 'emulateKarma' });
    }

    await page.setContent(chartTemplate(ccc));

    if (!ccc.HC) {
        await page.waitForFunction(() => !!window.Highcharts);
    }

    if (ccc.applyTestOptions) {
        await setTestingOptions(page, ccc.HC);
    }

    let chartCallbackBody: string | undefined;

    if (ccc.chartCallback) {
        const callbackFn = ccc.chartCallback;
        chartCallbackBody = callbackFn.toString();
        chartCallbackBody = chartCallbackBody.substring(
            chartCallbackBody.indexOf('{') + 1,
            chartCallbackBody.lastIndexOf('}')
        ).trim();
        ccc.chartCallback = undefined;
    }

    const handle = await page.evaluateHandle(
        ([{ chartConstructor, container, HC }, cc, serializedCallback]) => {
            type ChartFactories = Record<
                CreateChartConfig['chartConstructor'],
                (
                    container: CreateChartConfig['container'],
                    options: Partial<Highcharts.Options>,
                    callback?: (chart: Highcharts.Chart) => void
                ) => ReturnType<typeof Highcharts.chart>
            >;

            const HCInstance =
                (HC ?? window.Highcharts) as unknown as ChartFactories;

            const callback = serializedCallback ?
                (chart: Highcharts.Chart) => {
                    // eslint-disable-next-line @typescript-eslint/no-implied-eval
                    new Function(
                        'chart',
                        serializedCallback
                    )(chart);
                } :
                undefined;

            return HCInstance[chartConstructor](
                container,
                cc,
                callback
            );
        },
        [
            ccc,
            chartConfig,
            chartCallbackBody
        ] as [CreateChartConfig, object, string | undefined]
    );

    return handle;
}

export { expect } from '@playwright/test';
