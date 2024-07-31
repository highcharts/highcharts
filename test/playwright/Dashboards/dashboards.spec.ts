import { test, expect } from '@playwright/test';

test('stock tools gui is working', async ({ page }) => {
    const baseUrl = 'http://localhost:3030/samples/view?mobile=true&path=/';
    await page.goto(baseUrl + 'highcharts/cypress/stock-tools-gui');
    await page.locator('.highcharts-indicators').first().click();
    await page.locator('div.highcharts-popup').isVisible();
});

