import { test, expect } from '~/fixtures.ts';

test.describe('Sparklines update for null-cells', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/cypress/cell-update-sparkline/');
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

