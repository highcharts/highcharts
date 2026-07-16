import type { Browser, Page } from '@playwright/test';

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { products } from './products.ts';

const BENCH_DIR = resolve(__dirname, '..');

/**
 * Creates a page with one product build injected: an empty `#bench-root`, the
 * product's stylesheets and scripts, then the generic + product runtimes.
 *
 * Each build (base / PR) gets its own long-lived page so a whole benchmark run
 * can interleave measurements between them without re-injecting anything.
 */
export async function createBuildPage(
    browser: Browser,
    buildDir: string,
    product: string
): Promise<Page> {
    const assets = products[product];
    if (!assets) {
        throw new Error(`Unknown product "${product}"`);
    }

    const page = await browser.newPage({
        viewport: { width: 1200, height: 800 },
        deviceScaleFactor: 1
    });

    await page.setContent(
        '<!doctype html><html><head><meta charset="utf-8"></head>' +
        '<body><div id="bench-root"></div></body></html>'
    );

    for (const style of assets.styles) {
        await page.addStyleTag({
            content: readFileSync(join(buildDir, style), 'utf8')
        });
    }
    for (const script of assets.scripts) {
        await page.addScriptTag({
            content: readFileSync(join(buildDir, script), 'utf8')
        });
    }

    // Generic primitives first, then product-specific helpers.
    await page.addScriptTag({
        content: readFileSync(join(BENCH_DIR, 'harness', 'runtime.js'), 'utf8')
    });
    await page.addScriptTag({
        content: readFileSync(join(BENCH_DIR, assets.runtime), 'utf8')
    });

    return page;
}
