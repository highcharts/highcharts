import type { Route } from '@playwright/test';

import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path';

import { test as base } from '@playwright/test';

const contentTypes = {
 'js': 'application/javascript',
 'css': 'text/css'
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

const routes = [
    {
        pattern: '**/code.highcharts.com/**',
        handler: replaceHCCode
    }
]

export const test = base.extend<{}>({
    page: async ({ page }, use) => {
        if (!process.env.NO_REWRITES) {
            for (const route of routes) {
                await page.route(route.pattern, route.handler);
            }

        }

        await use(page);
    }
});

export { expect } from '@playwright/test';
