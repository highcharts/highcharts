const seriesPath = 'svg.highcharts-root .highcharts-series-group .highcharts-graph';

export const consumerStartedAttachment = 'consumer-check-started';

export const browserCases = [
    {
        id: 'Core renders two points and an annotation',
        page: 'app/core.html',
        modules: ['highcharts.js', 'modules/annotations.js'],
        async check(page, expect) {
            await expect(page.locator(seriesPath)).toBeVisible();
            await expect(page.locator('.highcharts-annotation-label')).toHaveText('First point');
            expect(await page.evaluate(() => window.chart.series[0].points.map(point => point.y)))
                .toEqual([1, 2]);
        }
    },
    {
        id: 'React updates chart points and SVG',
        page: 'app/react.html',
        modules: ['es-modules/masters/highcharts.src.js'],
        async check(page, expect) {
            const line = page.locator(seriesPath);
            await expect(line).toBeVisible();
            const originalPath = await line.getAttribute('d');
            await expect.poll(() => page.evaluate(() => window.chartValues?.())).toEqual([1, 2]);
            await page.getByRole('button', { name: 'Update data' }).click();
            await expect.poll(() => page.evaluate(() => window.chartValues?.())).toEqual([3, 5]);
            await expect(line).not.toHaveAttribute('d', originalPath);
        }
    },
    {
        id: 'Stock renders the navigator',
        page: 'app/stock.html',
        modules: ['highstock.js'],
        async check(page, expect) {
            await expect(page.locator('svg.highcharts-root .highcharts-navigator-outline'))
                .toBeVisible();
        }
    }
];
