import { test, expect } from '../../fixtures.ts';

// Equivalent of test/typescript-karma/masters/modules/boost.test.js

test.describe('Boost Module', () => {
    test('Highcharts boost composition', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/boost.src.js"></script>
                </head>
                <body>
                    <div id="container"></div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Highcharts = (window as any).Highcharts;
            return {
                hasWebGLSupport: typeof Highcharts.hasWebGLSupport === 'function'
            };
        });

        expect(result.hasWebGLSupport, 'Highcharts should be decorated with boost functions.').toBe(true);
    });

    test('Boost module creates chart with large data', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/boost.src.js"></script>
                </head>
                <body>
                    <div id="container" style="width: 600px; height: 400px;"></div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Highcharts = (window as any).Highcharts;

            // Generate large dataset
            const data: number[] = [];
            for (let i = 0; i < 10000; i++) {
                data.push(Math.random() * 100);
            }

            const chart = Highcharts.chart('container', {
                boost: {
                    useGPUTranslations: true,
                    seriesThreshold: 1
                },
                series: [{
                    type: 'line',
                    data: data,
                    boostThreshold: 1 // Force boost
                }],
                chart: {
                    animation: false
                }
            });

            const series = chart.series[0];

            return {
                chartExists: !!chart,
                seriesExists: !!series,
                // When boosted, series.data is empty - check options.data instead
                dataLength: series.options.data?.length ?? 0,
                // Check if boost was applied (series will have boosted properties)
                isBoosted: series.boosted === true
            };
        });

        expect(result.chartExists, 'Chart should be created').toBe(true);
        expect(result.seriesExists, 'Series should be created').toBe(true);
        expect(result.dataLength, 'Data should have 10000 points').toBe(10000);
        expect(result.isBoosted, 'Series should be boosted').toBe(true);
    });
});
