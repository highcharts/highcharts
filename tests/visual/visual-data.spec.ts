import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { setupRoutes } from '../fixtures';
import { captureVisualSVG } from './visual-capture';

const sources = JSON.parse(readFileSync(
    join(__dirname, 'data/index.json'), 'utf8'
)) as { url: string; filename: string; postData?: unknown }[];
const portfolio = sources.find(source =>
    source.filename === 'correlation-matrix.json'
);

async function prepareDataSample(page: Page): Promise<void> {
    await page.context().setOffline(true);
    await setupRoutes(page);
    await page.setContent('<div data-test-container><div id="container"></div></div>');
    for (const script of [
        'code/highcharts.src.js',
        'code/highcharts-more.src.js',
        'code/modules/data.src.js',
        'code/modules/streamgraph.src.js',
        'code/modules/no-data-to-display.src.js',
        'test/visual-comparator.js',
        'tests/visual/visual-setup.js'
    ]) {
        await page.addScriptTag({ path: script });
    }
    await page.evaluate(() => {
        window.HCVisualSetup.beforeSample();
        window.Highcharts.setOptions({
            chart: { animation: false },
            plotOptions: { series: { animation: false } }
        });
    });
}

test('capture waits for delayed CSV data after the empty chart loads', async ({ page }) => {
    await prepareDataSample(page);
    let release: () => void;
    const responseGate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/js-frameworks-trends.csv', async route => {
        await responseGate;
        await route.fulfill({
            path: 'samples/data/js-frameworks-trends.csv',
            contentType: 'text/csv'
        });
    });
    await page.addScriptTag({ path:
        'samples/highcharts/chartchooser/continuous-flow-streamgraph-monochrome/demo.js'
    });
    await expect(page.locator('.highcharts-no-data')).toHaveText('No data to display');
    expect(await page.evaluate(() =>
        window.Highcharts.charts.at(-1).hasLoaded
    )).toBe(true);
    const capturing = captureVisualSVG(page, 100, 10);
    // Let capture reach its readiness check while the response is held.
    await new Promise(resolve => setTimeout(resolve, 100));
    release();
    const svg = await capturing;
    expect(svg).not.toContain('No data to display');
    expect(await page.evaluate(() =>
        window.Highcharts.charts.at(-1).series.reduce(
            (n, s) => n + s.points.length, 0
        )
    )).toBe(596);
});

test('stalled data times out and cleanup permits a valid empty chart', async ({ page }) => {
    await prepareDataSample(page);
    await page.route('**/pending.csv', () => {});
    await page.evaluate(() => {
        window.Highcharts.chart('container', {
            data: { csvURL: 'http://localhost/pending.csv' }
        });
    });
    await expect(captureVisualSVG(page, 3, 10)).rejects.toThrow(
        'Chart or data failed to load within 30ms.'
    );
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(true);
    await page.evaluate(() => {
        window.HCVisualSetup.afterSample();
        window.HCVisualSetup.beforeSample();
        window.Highcharts.chart('container', { series: [] });
    });
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(false);
    expect(await captureVisualSVG(page)).toContain('No data to display');
});

test('visual portfolio fixture requires the recorded method and body', async ({ page }) => {
    await page.context().setOffline(true);
    await setupRoutes(page);
    await page.goto('http://localhost/shim.html');

    const results = await page.evaluate(async source => {
        const request = async (method: string, postData?: unknown) => {
            try {
                const response = await fetch(source.url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: postData === undefined ?
                        undefined : JSON.stringify(postData)
                });
                return response.status;
            } catch {
                return 'rejected';
            }
        };
        return [
            await request('POST', source.postData),
            await request('POST', { portfolios: [] }),
            await request('GET')
        ];
    }, portfolio);

    expect(results).toEqual([200, 'rejected', 'rejected']);
});
