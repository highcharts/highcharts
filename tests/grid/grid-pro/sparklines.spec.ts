import { test, expect } from '~/fixtures.ts';

test.describe('Sparklines update for null-cells', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/e2e/cell-update-sparkline/');
    });

    test('Highcharts should be built & loaded', async ({ page }) => {
        const highchartsExists = await page.evaluate(() => {
            return typeof (window as any).Highcharts !== 'undefined';
        });
        expect(highchartsExists).toBe(true);
    });

    test('Sparkline should be updated when cell value is set to null', async ({ page }) => {
        const cellSelector = 'tr[data-row-index="3"] td[data-column-id="Trend"]';
        await page.locator('#addRow').click();
        const cell = page.locator(cellSelector);
        await cell.dblclick();
        await page.keyboard.type('1,2,3');
        await page.keyboard.press('Enter');
        await expect(cell.locator('.highcharts-series-group')).toBeVisible();
    });
});

test.describe('Sparkline cell values', () => {
    async function load(page: any, values: string[]) {
        await page.goto('/grid-pro/e2e/cell-update-sparkline/');
        await page.waitForFunction(
            () => typeof (window as any).Highcharts !== 'undefined'
        );
        await page.evaluate((spark: string[]) => {
            (window as any).Grid.grid('container', {
                data: { columns: { spark } },
                columns: [{
                    id: 'spark',
                    cells: { renderer: { type: 'sparkline' } }
                }]
            });
        }, values);
        await page.locator('td[data-column-id="spark"]').first().waitFor();
    }

    test('A value that is not JSON does not abort the render', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (e: Error) => errors.push(e.message));

        await load(page, ['1, 2, 3', 'not json at all', '4, 5, 6']);

        const cells = page.locator('td[data-column-id="spark"]');
        await expect(cells).toHaveCount(3);
        // Every cell keeps its chart, the bad one simply has no points.
        await expect(cells.nth(1).locator('svg')).toHaveCount(1);
        await expect(cells.nth(2).locator('.highcharts-series-group'))
            .toBeVisible();
        expect(errors).toEqual([]);
    });

    test('Pairs and point objects are still accepted', async ({ page }) => {
        await load(page, ['[[0,1],[1,5],[2,3]]', '[{"y":4},{"y":9}]']);

        const cells = page.locator('td[data-column-id="spark"]');
        await expect(cells.nth(0).locator('.highcharts-series-group'))
            .toBeVisible();
        await expect(cells.nth(1).locator('.highcharts-series-group'))
            .toBeVisible();
    });
});

