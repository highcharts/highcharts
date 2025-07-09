import { test, expect } from '@playwright/test';

test('Chart creation', async ({ page }) => {
    await page.setContent('<div id="container"></container>');
    await page.addScriptTag({ path: './code/highcharts.src.js' });

    await page.evaluate(() => {
        window.Highcharts.chart('container', {});
    });

    await expect(page.locator('#container'))
        .toHaveAttribute('data-highcharts-chart', '0');
});
