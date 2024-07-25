import { test, expect } from '@playwright/test';

test('stock tools gui is working', async ({ page }) => {

    const urlPrefix = "view?path=";
    await page.goto(urlPrefix + 'highcharts/cypress/stock-tools-gui');
    await page.locator('.highcharts-indicators').first().click();
    await page.locator('div.highcharts-popup').isVisible();
});

