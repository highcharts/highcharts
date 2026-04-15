/**
 * Tests for negativeColor option in styled mode (#24126).
 */
import { test, expect } from '~/fixtures.ts';

async function setupPage(page: import('@playwright/test').Page) {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head></head>
        <body><div id="container"></div></body>
        </html>
    `);
    await page.addScriptTag({ url: 'https://code.highcharts.com/highcharts.js' });
    await page.waitForFunction(() => !!(window as any).Highcharts);
}

test('negativeColor: false does not add highcharts-negative class (#24126)', async ({ page }) => {
    await setupPage(page);

    const hasNegativeClass = await page.evaluate(() => {
        const chart = (window as any).Highcharts.chart('container', {
            chart: { styledMode: true },
            series: [{
                type: 'column',
                negativeColor: false,
                data: [5, -3, 4, -2, 6]
            }]
        });

        const negativePoints =
            chart.series[0].points.filter((p: any) => p.negative);
        return negativePoints.some((p: any) =>
            p.graphic?.element?.classList?.contains('highcharts-negative')
        );
    });

    expect(hasNegativeClass).toBe(false);
});
