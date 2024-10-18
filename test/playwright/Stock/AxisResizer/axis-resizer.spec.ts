// create a test in playwright that checks if the axis resizer is working
import { test, expect } from '@playwright/test';
declare const Highcharts: any;

test('axis resizer gui is working', async ({ page }) => {
    const urlPrefix = 'view?path=';
    await page.goto(`${urlPrefix}highcharts/cypress/stock-tools-gui`);
    const resizer = page.locator('.highcharts-axis-resizer');
    const box = await resizer.boundingBox();

    const initialLen = await page.evaluate(() => {
        return Highcharts.charts[0].yAxis[0].len;
    });

    const translation = 100;
    if (box) {
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX, startY - translation);
        await page.mouse.up();
    } else {
        throw new Error('resizer not found');
    }

    const finalLen = await page.evaluate(() => {
        return Highcharts.charts[0].yAxis[0].len;
    });
    expect(initialLen).toBe(finalLen + translation);

});
