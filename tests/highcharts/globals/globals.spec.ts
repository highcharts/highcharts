import { test, expect } from '~/fixtures.ts';

// Equivalent of test/typescript-karma/Core/Globals.test.js
// The original test is for AMD loading of Highcharts package. This is a Playwright equivalent
// that verifies Highcharts loads correctly via script tag.

test.describe('Globals', () => {
    test('Highcharts object is available via script tag', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                </head>
                <body>
                    <div id="container"></div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Highcharts = (window as any).Highcharts;
            return {
                isObject: typeof Highcharts === 'object' && Highcharts !== null,
                hasChartMethod: typeof Highcharts?.chart === 'function',
                hasProduct: typeof Highcharts?.product === 'string'
            };
        });

        expect(result.isObject, 'Highcharts should be an object').toBe(true);
        expect(result.hasChartMethod, 'Highcharts should have chart method').toBe(true);
        expect(result.hasProduct, 'Highcharts should have product property').toBe(true);
    });
});
