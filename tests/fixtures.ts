import type { Route, Request } from '@playwright/test';

import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

import { test as base } from '@playwright/test';

const contentTypes = {
    js: 'application/javascript',
    css: 'text/css',
    csv: 'text/csv'
};

async function replaceHCCode(route: Route) {
    const url = route.request().url();
    let relativePath = url.split('/code.highcharts.com/')[1]
        .replace(/^(stock|maps|gantt|grid)\//u, '');

    if (relativePath.endsWith('.js') && !relativePath.endsWith('.src.js')) {
        relativePath = relativePath.replace('.js', '.src.js');
    }

    const localPath = join(
        __dirname,
        '../code',
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
            headers: {
                'Content-Type': contentTypes[extname(localPath)]
            }
        });
    } catch (_err) {
        await route.abort();
        throw new Error(`Missing local file for ${relativePath}`);
    }
}

type RouteType = {
    pattern: string | RegExp | ((url: URL) => boolean);
    handler: (route: Route, request: Request) => any;
}

async function getJSONSources(): Promise<RouteType[]> {
    const routes: RouteType[] = [];
    const { default: sources } = await import(
        '../samples/data/json-sources/index.json',
        { with: { type: 'json' } }
    );

    for (const source of sources) {
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
        const [_all, filename] = match;
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
    const url = route.request().url();
    const match = url.match(/(?:samples\/data\/|demo-live-data.+\/)(.+\.*)/u);

    if (match?.length) {
        const [_all, filename] = match;
        try {
            const samplePath = join('samples/data', filename);
            const filePath = join(__dirname, '..', samplePath);
            const data = await readFile(filePath, 'utf8');

            test.info().annotations.push({
                type: 'redirect',
                description: `${url} --> ${samplePath}`
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
    throw new Error('Failed to find a matching dataset');
}

export const test = base.extend<{}>({
    page: async ({ page }, use) => {
        if (!process.env.NO_REWRITES) {
            const routes: RouteType[] = [
                {
                    pattern: '**/code.highcharts.com/**',
                    handler: replaceHCCode
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
                    pattern: '**/**/mapdata/**',
                    handler: replaceMapData
                },
                ...(await getJSONSources())
            ];

            for (const route of routes) {
                await page.route(route.pattern, route.handler);
            }
        }

        await use(page);
    }
});

export { expect } from '@playwright/test';
