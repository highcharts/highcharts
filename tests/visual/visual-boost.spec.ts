import { test, expect, type Page } from '@playwright/test';
import { captureVisualSVG } from './visual-capture';
import { setTestingOptions } from '../utils';

test.use({ launchOptions: { args: ['--disable-webgl'] } });

async function prepareBoostSample(page: Page): Promise<void> {
    await page.setContent(
        '<div data-test-container><div id="container" ' +
        'style="width: 600px"></div></div>'
    );
    for (const script of [
        'code/highcharts.src.js',
        'code/highcharts-more.src.js',
        'code/modules/exporting.src.js',
        'code/modules/boost-canvas.src.js',
        'code/modules/boost.src.js',
        'test/visual-comparator.js',
        'tests/visual/visual-setup.js'
    ]) {
        await page.addScriptTag({ path: script });
    }
    await page.clock.install({ time: new Date('2024-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2024-01-01T00:00:01Z'));
    await page.evaluate(() => window.HCVisualSetup.beforeSample());
    await setTestingOptions(page);
}

test('capture waits for boost canvas drawing after chart load', async ({ page }) => {
    await prepareBoostSample(page);
    await page.addScriptTag({ path:
        'samples/highcharts/boost/scatter-colorbypoint/demo.js'
    });
    expect(await page.evaluate(() =>
        window.Highcharts.charts[0].hasLoaded
    )).toBe(true);

    const capturing = captureVisualSVG(page, 100, 10);
    // Enter capture before releasing the paused animation-frame chunks.
    await page.evaluate(() => undefined);
    await page.clock.runFor(1);
    await page.clock.runFor(200);
    const svg = await capturing;
    const opaquePixels = await page.evaluate(async svg => {
        const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
        const image = new Image();
        image.src = doc.querySelector('image').getAttribute('xlink:href');
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(
            0, 0, canvas.width, canvas.height
        ).data;
        return pixels.filter((_, i) => i % 4 === 3 && pixels[i] > 0).length;
    }, svg);
    expect(opaquePixels).toBeGreaterThan(0);
});

test('capture waits for overlapping boost redraws and export draws', async ({
    page
}) => {
    await prepareBoostSample(page);
    await page.evaluate(() => {
        window.Highcharts.chart('container', {
            series: [0, 1].map(offset => ({
                type: 'scatter',
                boostThreshold: 1,
                data: Array.from({ length: 10000 }, (_, i) => (
                    [i, i % 10 + offset]
                ))
            }))
        });
    });
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(true);

    await page.evaluate(() => {
        const chart = window.Highcharts.charts[0];
        chart.renderer.forExport = true;
        chart.series.forEach(series => series.renderCanvas());
        chart.renderer.forExport = false;
    });
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(true);

    await page.clock.runFor(16);
    await page.evaluate(() => {
        const chart = window.Highcharts.charts[0];
        chart.series.forEach(series => { series.isDirty = true; });
        chart.redraw();
    });
    const capturing = captureVisualSVG(page, 100, 10);
    await page.evaluate(() => undefined);
    // The first draws finish at 48 ms; the redraws still have work pending.
    await page.clock.runFor(32);
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(true);
    await page.clock.runFor(200);
    expect(await capturing).toContain('data:image/png;base64,');
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(false);
});

test('synchronous and hidden boost series do not leave pending draws', async ({
    page
}) => {
    await prepareBoostSample(page);
    await page.evaluate(() => window.Highcharts.chart('container', {
        series: [{ type: 'scatter', boostThreshold: 1, data: [1, 2] }, {
            type: 'scatter', boostThreshold: 1, data: [3, 4], visible: false
        }]
    }));
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(false);
    const capturing = captureVisualSVG(page);
    await page.evaluate(() => undefined);
    await page.clock.runFor(1);
    expect(await capturing).toContain('data:image/png;base64,');
});

test('destroying a boosted series clears its pending draw', async ({ page }) => {
    await prepareBoostSample(page);
    await page.addScriptTag({ path:
        'samples/highcharts/boost/scatter-colorbypoint/demo.js'
    });
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(true);
    await page.evaluate(() => window.Highcharts.charts[0].series[0].remove());
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(false);
});

test('stalled boost drawing times out and cleanup restores the renderer', async ({
    page
}) => {
    await prepareBoostSample(page);
    await page.addScriptTag({ path:
        'samples/highcharts/boost/scatter-colorbypoint/demo.js'
    });
    // The third drawing frame is at 48 ms, after this readiness deadline.
    const timedOut = expect(captureVisualSVG(page, 3, 10)).rejects.toThrow(
        'Boost rendering failed to finish within 30ms.'
    );
    await page.evaluate(() => undefined);
    await page.clock.runFor(31);
    await timedOut;
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(true);

    await page.evaluate(() => {
        window.HCVisualSetup.afterSample();
        window.HCVisualSetup.beforeSample();
        window.Highcharts.chart('container', { series: [] });
    });
    expect(await page.evaluate(() =>
        window.HCVisualSetup.hasPendingRenders()
    )).toBe(false);
    const capturing = captureVisualSVG(page);
    await page.evaluate(() => undefined);
    await page.clock.runFor(100);
    expect(await capturing).toContain('<svg');
});

test('tracks WebGL drawing through its native events', async ({ playwright }) => {
    // Use a separate browser because this file forces the canvas fallback.
    const browser = await playwright.chromium.launch({ args: [
        '--enable-gpu',
        '--ignore-gpu-blocklist',
        '--enable-zero-copy',
        '--use-angle=gl',
        '--use-gl=angle',
        '--disable-software-rasterizer'
    ] });
    const page = await browser.newPage();
    try {
        await prepareBoostSample(page);
        // eslint-disable-next-line playwright/no-skipped-test
        test.skip(!await page.evaluate(() =>
            (window.Highcharts as any).hasWebGLSupport()
        ), 'WebGL is unavailable in this browser');
        await page.addScriptTag({ path:
            'samples/highcharts/boost/scatter-colorbypoint/demo.js'
        });
        expect(await page.evaluate(() =>
            window.HCVisualSetup.hasPendingRenders()
        )).toBe(true);
        const capturing = captureVisualSVG(page, 100, 10);
        await page.evaluate(() => undefined);
        await page.clock.runFor(200);
        expect(await capturing).toContain('data:image/png;base64,');
        expect(await page.evaluate(() =>
            window.HCVisualSetup.hasPendingRenders()
        )).toBe(false);
    } finally {
        await browser.close();
    }
});
