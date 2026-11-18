import { expect, test as base } from '@playwright/test';
import { preview } from 'vite';

const test = base.extend({
    origin: [async ({}, use) => {
        const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
        try {
            await use(`http://127.0.0.1:${server.httpServer.address().port}`);
        } finally {
            await server.close();
        }
    }, { scope: 'worker' }],
    page: async ({ page }, use) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
            if (message.type() === 'error') {
                errors.push(message.text());
            }
        });
        await use(page);
        expect(errors).toEqual([]);
    }
});

const seriesPath = 'svg.highcharts-root .highcharts-series-group .highcharts-graph';

test('Core renders two points and an annotation', async ({ page, origin }, testInfo) => {
    await testInfo.attach('consumer-check-started', { body: 'true' });
    await page.goto(`${origin}/app/core.html`);
    await expect(page.locator(seriesPath)).toBeVisible();
    await expect(page.locator('.highcharts-annotation-label')).toHaveText('First point');
    expect(await page.evaluate(() => window.chart.series[0].points.map(point => point.y)))
        .toEqual([1, 2]);
});

test('React updates chart points and SVG', async ({ page, origin }, testInfo) => {
    await testInfo.attach('consumer-check-started', { body: 'true' });
    await page.goto(`${origin}/app/react.html`);
    const line = page.locator(seriesPath);
    await expect(line).toBeVisible();
    const originalPath = await line.getAttribute('d');
    await expect.poll(() => page.evaluate(() => window.chartValues?.())).toEqual([1, 2]);
    await page.getByRole('button', { name: 'Update data' }).click();
    await expect.poll(() => page.evaluate(() => window.chartValues?.())).toEqual([3, 5]);
    await expect(line).not.toHaveAttribute('d', originalPath);
});
