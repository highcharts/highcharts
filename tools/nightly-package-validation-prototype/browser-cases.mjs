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
    },
    {
        id: 'Maps joins data and renders both regions',
        page: 'app/maps.html',
        modules: ['highmaps.js'],
        async check(page, expect) {
            const regions = page.locator('svg.highcharts-root .highcharts-map-series path.highcharts-point');
            const west = regions.and(page.locator('.highcharts-key-west'));
            const east = regions.and(page.locator('.highcharts-key-east'));
            await expect(regions).toHaveCount(2);
            await expect(west).toBeVisible();
            await expect(east).toBeVisible();
            const westRight = await west.evaluate(path => path.getBoundingClientRect().right);
            const eastLeft = await east.evaluate(path => path.getBoundingClientRect().left);
            expect(westRight).toBeLessThan(eastLeft);

            expect(await page.evaluate(() => Object.fromEntries(
                window.chart.series[0].points.map(point => [point.name, point.value])
            ))).toEqual({ East: 9, West: 3 });
        }
    },
    {
        id: 'Gantt renders two tasks and their dependency',
        page: 'app/gantt.html',
        modules: ['highcharts-gantt.js'],
        async check(page, expect) {
            const chart = page.locator('svg.highcharts-root');
            const tasks = chart.locator('.highcharts-gantt-series .highcharts-partfill-original');
            await expect(tasks).toHaveCount(2);
            await expect(tasks.nth(0)).toBeVisible();
            await expect(tasks.nth(1)).toBeVisible();

            const dependency = chart.locator('path.highcharts-point-connecting-path');
            await expect(dependency).toBeVisible();
            expect(await dependency.evaluate(path => path.getTotalLength())).toBeGreaterThan(0);
        }
    },
    {
        id: 'Stock indicators render a two-point simple moving average',
        page: 'app/indicators.html',
        modules: ['highstock.js', 'indicators/indicators.js'],
        async check(page, expect) {
            await expect(page.locator('svg.highcharts-root .highcharts-sma-series .highcharts-graph'))
                .toBeVisible();
            expect(await page.evaluate(() => window.chart.series.find(series => series.type === 'sma')
                .points.map(point => point.y))).toEqual([3, 6]);
        }
    },
    {
        id: 'Exporting returns a CSV with the series heading and data',
        page: 'app/exporting.html',
        modules: ['modules/exporting.js', 'modules/export-data.js'],
        async check(page, expect) {
            const csv = await page.evaluate(() => window.csv);
            expect(csv).toBe('"Category","Orders"\n"Monday",4\n"Tuesday",7');
        }
    }
];
