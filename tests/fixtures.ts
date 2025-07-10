import type { Route, Request } from '@playwright/test';

import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path';

import { test as base } from '@playwright/test';

const contentTypes = {
 'js': 'application/javascript',
 'css': 'text/css',
 'csv': 'text/csv'
};

async function replaceHCCode(route: Route) {
    const url = route.request().url();
    let relativePath = url.split('/code.highcharts.com/')[1]
        .replace(/^(stock|maps|gantt|grid)\//, '');

    if (relativePath.endsWith('.js') && !relativePath.endsWith('.src.js')) {
        relativePath = relativePath.replace('.js', '.src.js');
    }

    let localPath = join(
        __dirname,
        '../code' ,
        relativePath
    );

    test.info().annotations.push({
        type: 'redirect',
        description: `${url} --> ${join('code', relativePath)}`
    })

    try {
        const body = await readFile(localPath);
        await route.fulfill({
            status: 200,
            body,
            headers: {
                'Content-Type': contentTypes[extname(localPath)]
            }
        });
    } catch (err) {
        await route.abort();
        throw new Error(`Missing local file for ${relativePath}`);
    }
}

type RouteType = {
    pattern: string | RegExp | ((url: URL) => boolean);
    handler: (route: Route, request: Request ) => any;
}

async function getJSONSources(): Promise<RouteType[]>{
    let routes: RouteType[] = []
    const { default: sources } = await import(
        '../samples/data/json-sources/index.json',
        { with: { type: 'json'} }
    );

    for (const source of sources){
        routes.push({
            pattern: source.url,
            handler: async (route) => {
                try {
                    const localPath = join(
                        '../samples/data/json-sources',
                        source.filename
                    );

                    const body = await readFile(join(__dirname, localPath));

                    test.info().annotations.push({
                        type: 'redirect',
                        description: `${source.url} --> ${localPath}`
                    });

                    await route.fulfill({
                        status: 200,
                        body,
                        contentType: contentTypes[extname(source.filename)],
                    });
                } catch {
                    await route.abort();
                    throw new Error(`Unable to resolve local JSON source for ${source.url}`)
                }
            }
        })
    }

    return routes;
}


export const test = base.extend<{}>({
    page: async ({ page }, use) => {
        if (!process.env.NO_REWRITES) {
            // TODO: mapdata
            // TODO: jsdelivr
            // TODO: demo-live-data
            const routes: RouteType[] = [
                {
                    pattern: '**/code.highcharts.com/**',
                    handler: replaceHCCode
                },
                ...(await getJSONSources())
            ]

            for (const route of routes) {
                await page.route(route.pattern, route.handler);
            }
        }

        await use(page);
    }
});

export { expect } from '@playwright/test';
