import { test, expect } from '~/fixtures.ts';

test.describe('Creating charts from Grid data', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/e2e/create-chart/');
        await page.waitForFunction(
            () => !!(window as any).Grid?.grids?.[0]?.viewport
        );
    });

    test('Recommends chart types from the column data types', async ({ page }) => {
        const recommendations = await page.evaluate(() => {
            const { charting } = (window as any).Grid.grids[0];
            return {
                datetime: charting.getRecommendations(['date', 'sales']),
                category: charting.getRecommendations(['region', 'sales']),
                categories: charting.getRecommendations(
                    ['region', 'sales', 'cost']
                ),
                numbers: charting.getRecommendations(['sales', 'cost']),
                // Bubble needs highcharts-more.js, which the page skips
                threeNumbers: charting.getRecommendations(
                    ['sales', 'cost', 'units']
                ),
                text: charting.getRecommendations(['region'])
            };
        });

        expect(recommendations.datetime[0]).toBe('line');
        expect(recommendations.category).toEqual(
            ['column', 'pie', 'bar', 'line']
        );
        expect(recommendations.categories).toEqual(
            ['column', 'stackedColumn', 'bar', 'line', 'area']
        );
        expect(recommendations.numbers[0]).toBe('scatter');
        expect(recommendations.threeNumbers).not.toContain('bubble');
        expect(recommendations.threeNumbers[0]).toBe('scatter');
        expect(recommendations.text).toEqual([]);
    });

    test('Charts the data as presented after sorting', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            await grid.viewport.getColumn('sales').sorting.setOrder('desc');

            const chart = grid.charting.createChart({
                columns: ['region', 'sales'],
                renderTo: 'chart'
            });

            return {
                type: chart.series[0].type,
                name: chart.series[0].name,
                categories: chart.xAxis[0].categories,
                data: chart.series[0].points.map((p: any) => p.y)
            };
        });

        expect(result.type).toBe('column');
        expect(result.name).toBe('Sales');
        expect(result.categories).toEqual(['North', 'East', 'South']);
        expect(result.data).toEqual([30, 20, 10]);
    });

    test('Charts only the given rows, in the order presented', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            await grid.viewport.getColumn('sales').sorting.setOrder('asc');

            const chart = grid.charting.createChart({
                columns: ['region', 'sales'],
                // Row ids default to the original row indexes
                rows: [0, 2],
                renderTo: 'chart'
            });

            return {
                categories: chart.xAxis[0].categories,
                data: chart.series[0].points.map((p: any) => p.y)
            };
        });

        expect(result.categories).toEqual(['East', 'North']);
        expect(result.data).toEqual([20, 30]);
    });

    test('Stacks columns and formats tooltips like the cells', async ({ page }) => {
        const result = await page.evaluate(() => {
            const chart = (window as any).Grid.grids[0].charting.createChart({
                columns: ['region', 'sales', 'cost'],
                type: 'stackedColumn',
                renderTo: 'chart'
            });

            chart.series[0].points[0].onMouseOver();

            return {
                types: chart.series.map((s: any) => s.type),
                stacking: chart.series[0].options.stacking,
                tooltip: chart.tooltip.label.text.element.textContent
            };
        });

        expect(result.types).toEqual(['column', 'column']);
        expect(result.stacking).toBe('normal');
        expect(result.tooltip).toContain('Sales: $30k');
    });

    test('Sorts time series by time', async ({ page }) => {
        const xValues = await page.evaluate(() => {
            const chart = (window as any).Grid.grids[0].charting.createChart({
                columns: ['date', 'sales'],
                renderTo: 'chart'
            });

            return chart.series[0].points.map((p: any) => p.x);
        });

        expect(xValues).toEqual([
            Date.UTC(2025, 0, 1),
            Date.UTC(2025, 1, 1),
            Date.UTC(2025, 2, 1)
        ]);
    });

    test('Opens the chart in a popup that destroys it on close', async ({ page }) => {
        await page.evaluate(() => {
            (window as any).Grid.grids[0].charting.createChart({
                columns: ['region', 'sales'],
                type: 'pie'
            });
        });

        const popup = page.locator('.hcg-chart-popup');
        await expect(popup.locator('.highcharts-series.highcharts-pie-series')).toBeVisible();

        // A Grid reflow keeps the popup open
        await page.evaluate(() => {
            (window as any).Grid.grids[0].charting.popup.reflow();
        });
        await expect(popup).toHaveCount(1);

        await page.keyboard.press('Escape');
        await expect(popup).toHaveCount(0);

        const charts = await page.evaluate(
            () => (window as any).Highcharts.charts.filter(Boolean).length
        );
        expect(charts).toBe(0);
    });

    test('Names series after headers that are not rendered', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const columns: Record<string, number[]> = {};
            for (let i = 0; i < 40; ++i) {
                columns['c' + i] = [i, i + 1];
            }

            const container = document.createElement('div');
            container.style.width = '300px';
            document.body.appendChild(container);

            const grid = await (window as any).Grid.grid(container, {
                data: { columns },
                columnDefaults: { width: 80 },
                columns: [{
                    id: 'c39',
                    header: { format: '<b>Last</b> column' }
                }],
                rendering: {
                    columns: { virtualization: true }
                }
            }, true);

            const chart = grid.charting.createChart({
                columns: ['c39'],
                renderTo: 'chart'
            });

            return {
                rendered: !!container.querySelector(
                    'th[data-column-id="c39"]'
                ),
                name: chart.series[0].name
            };
        });

        expect(result.rendered).toBe(false);
        expect(result.name).toBe('Last column');
    });

    test('Lets beforeChartCreate change or cancel the chart', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];

            await grid.update({
                events: {
                    beforeChartCreate: function (e: any): void {
                        if (e.chartType === 'pie') {
                            e.preventDefault();
                        }
                        e.chartOptions.title = { text: 'Custom' };
                    }
                }
            });

            const cancelled = grid.charting.createChart({
                columns: ['region', 'sales'],
                type: 'pie',
                renderTo: 'chart'
            });
            const chart = grid.charting.createChart({
                columns: ['region', 'sales'],
                renderTo: 'chart'
            });

            return {
                cancelled: cancelled === void 0,
                title: chart.title.textStr
            };
        });

        expect(result.cancelled).toBe(true);
        expect(result.title).toBe('Custom');
    });
});
