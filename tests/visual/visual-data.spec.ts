import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { setupRoutes } from '../fixtures';
import { captureVisualSVG } from './visual-capture';

const sources = JSON.parse(readFileSync(
    join(__dirname, 'data/index.json'), 'utf8'
)) as { url: string; filename: string; postData?: unknown }[];
const portfolios = sources.filter(source => source.postData);

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

test('capture waits for image markers and the chart load handler', async ({ page }) => {
    await prepareDataSample(page);
    let release: () => void;
    const responseGate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/delayed-marker.svg', async route => {
        await responseGate;
        await route.fulfill({
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'
        });
    });
    await page.evaluate(() => {
        window.Highcharts.chart('container', {
            chart: {
                events: {
                    load() {
                        this.setTitle({ text: 'Images loaded' });
                    }
                }
            },
            title: { text: 'Images pending' },
            series: [{
                data: [1],
                marker: { symbol: 'url(http://localhost/delayed-marker.svg)' }
            }]
        });
    });
    expect(await page.evaluate(() =>
        !!window.Highcharts.charts[0].hasLoaded
    )).toBe(false);

    let captured = false;
    const capturing = captureVisualSVG(page, 100, 10).then(svg => {
        captured = true;
        return svg;
    });
    // Keep the image pending while capture reaches its readiness check.
    await new Promise(resolve => setTimeout(resolve, 100));
    const capturedBeforeLoad = captured;
    release();
    const svg = await capturing;
    expect(capturedBeforeLoad).toBe(false);
    expect(svg.includes('Images loaded')).toBe(true);
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

test('fetch requests stay pending until the response body is consumed', async ({ page }) => {
    await prepareDataSample(page);
    let release: () => void;
    const responseGate = new Promise<void>(resolve => { release = resolve; });
    await page.route('http://localhost/x.json', async route => {
        await responseGate;
        await route.fulfill({ contentType: 'application/json', body: '{"ok":true}' });
    });
    const fetching = page.evaluate(async () => {
        const response = await fetch('http://localhost/x.json');
        return response.json();
    });
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(true);
    release();
    await expect(fetching).resolves.toEqual({ ok: true });
    await expect.poll(() => page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(false);
});

test('rejected fetch requests are removed from pending requests', async ({ page }) => {
    await prepareDataSample(page);
    await page.route('http://localhost/x.json', route => route.abort());
    const rejected = page.evaluate(() => fetch('http://localhost/x.json'));
    await expect(rejected).rejects.toThrow();
    await expect.poll(() => page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(false);
});

test('sequential fetches remain pending between responses', async ({ page }) => {
    await prepareDataSample(page);
    let releaseSecond: () => void;
    const secondGate = new Promise<void>(resolve => {
        releaseSecond = resolve;
    });
    let secondStarted: () => void;
    const secondRequest = new Promise<void>(resolve => {
        secondStarted = resolve;
    });
    await page.route('http://localhost/first.json', route => route.fulfill({
        contentType: 'application/json', body: '{"ok":true}'
    }));
    await page.route('http://localhost/second.json', async route => {
        secondStarted();
        await secondGate;
        await route.fulfill({ contentType: 'application/json', body: '{"ok":true}' });
    });
    const fetching = page.evaluate(async () => {
        let pendingAtFirstCompletion = false;
        await fetch('http://localhost/first.json').then(() => {
            pendingAtFirstCompletion =
                window.HCVisualSetup.hasPendingRequests();
            return fetch('http://localhost/second.json');
        }).then(response => response.json());
        return pendingAtFirstCompletion;
    });
    await secondRequest;
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(true);
    releaseSecond();
    await expect(fetching).resolves.toBe(true);
    await expect.poll(() => page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(false);
});

test('cleanup restores fetch and ignores a late response', async ({ page }) => {
    await prepareDataSample(page);
    let release: () => void;
    const responseGate = new Promise<void>(resolve => { release = resolve; });
    await page.route('http://localhost/x.json', async route => {
        await responseGate;
        await route.fulfill({ contentType: 'application/json', body: '{"ok":true}' });
    });
    const fetching = page.evaluate(() => fetch('http://localhost/x.json'));
    await expect.poll(() => page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(true);
    await page.evaluate(() => window.HCVisualSetup.afterSample());
    expect(await page.evaluate(() => window.fetch.toString())).toContain('[native code]');
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(false);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    release();
    await expect(fetching).resolves.toBeTruthy();
    await page.evaluate(() => window.HCVisualSetup.beforeSample());
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRequests()
    )).toBe(false);
    expect(errors).toEqual([]);
});

test('capture keeps the main map when its locator loads later', async ({ page }) => {
    await prepareDataSample(page);
    await page.addScriptTag({ path: 'code/modules/map.src.js' });
    await page.addStyleTag({ path: 'samples/maps/demo/locator-map/demo.css' });
    let release: () => void;
    const responseGate = new Promise<void>(resolve => { release = resolve; });
    let requests = 0;
    await page.route('**/custom/world.topo.json', async route => {
        if (++requests === 2) {
            await responseGate;
        }
        await route.fallback();
    });

    try {
        await page.addScriptTag({ path: 'samples/maps/demo/locator-map/demo.js' });
        await expect(page.locator('#container .highcharts-container')).toHaveCount(1);
        const capturing = captureVisualSVG(page);
        // Let capture reach its readiness check before releasing the locator.
        await new Promise(resolve => setTimeout(resolve, 100));
        release();
        const mainSVG = await capturing;
        expect(mainSVG).toContain('Highcharts Map with Locator');

        await expect(page.locator('#container .highcharts-container')).toHaveCount(2);
        expect(await captureVisualSVG(page)).toBe(mainSVG);
    } finally {
        release();
    }
});

test('capture waits for the deferred earth statistics dataset', async ({ page }) => {
    await prepareDataSample(page);
    for (const script of [
        'code/modules/map.src.js',
        'code/modules/geoheatmap.src.js'
    ]) {
        await page.addScriptTag({ path: script });
    }
    await page.locator('[data-test-container]').evaluate(element => {
        element.innerHTML = '<div id="container"></div>' +
            '<select id="dataset"></select>';
    });

    // Start capture before the initial zero-delay timer populates the chart.
    await page.clock.install({ time: new Date('2024-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2024-01-01T00:00:01Z'));
    await page.addScriptTag({ path:
        'samples/maps/demo/geoheatmap-earth-statistics/demo.js'
    });
    await expect(page.locator('.highcharts-container')).toHaveCount(1);

    const capturing = captureVisualSVG(page);
    // Let capture enter the browser before advancing its paused timers.
    await page.evaluate(() => undefined);
    await page.clock.runFor(1);
    const svg = await capturing;
    expect(svg.includes(
        'Land Surface (day) and Sea Temperature in August 2022'
    )).toBe(true);
    expect(svg.includes('data:image/png;base64,')).toBe(true);
    expect(svg.includes('-40°C')).toBe(true);
});

test('visual POST fixtures require the recorded method and body', async ({ page }) => {
    await page.context().setOffline(true);
    await setupRoutes(page);
    await page.goto('http://localhost/shim.html');

    const results = await page.evaluate(async sources => {
        const source = sources[0];
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
        const matches = [];
        for (const source of sources) {
            matches.push(await fetch(source.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(source.postData)
            }).then(response => response.status).catch(() => 'rejected'));
        }
        return [
            ...matches,
            await request('POST', { portfolios: [] }),
            await request('GET')
        ];
    }, portfolios);

    expect(results).toEqual([
        ...portfolios.map(() => 200), 'rejected', 'rejected'
    ]);
});
