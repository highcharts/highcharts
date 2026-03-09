import { test, expect } from '~/fixtures.ts';

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

    test('Boost with pixelRatio > 1 renders full chart (not just quarter)', async ({
        page
    }) => {
        await page.setContent(
            `
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
        `,
            { waitUntil: 'networkidle' }
        );

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;

            const data: number[][] = [];
            for (let i = 0; i < 100000; i++) {
                data.push([i, Math.sin(i / 500) * 10 + Math.random() * 5]);
            }

            const chart = Highcharts.chart('container', {
                boost: {
                    pixelRatio: 2,
                    useGPUTranslations: true,
                    seriesThreshold: 1
                },
                series: [{
                    type: 'line',
                    data,
                    boostThreshold: 1
                }],
                chart: { animation: false }
            });

            await new Promise((r) => setTimeout(r, 500));

            const canvas = chart.boost?.canvas;
            if (!canvas) {
                return { ok: false, reason: 'no boost canvas' };
            }

            const expectedW = chart.chartWidth * 2;
            const expectedH = chart.chartHeight * 2;
            const dimsOk =
                canvas.width === expectedW && canvas.height === expectedH;

            const tmp = document.createElement('canvas');
            tmp.width = canvas.width;
            tmp.height = canvas.height;
            const ctx = tmp.getContext('2d');
            if (!ctx) {
                return { ok: dimsOk, reason: 'no 2d context', dimsOk };
            }
            ctx.drawImage(canvas, 0, 0);

            const pr = 2;
            const px =
                (chart.plotLeft + chart.plotWidth * 0.75) * pr;
            const py =
                (chart.plotTop + chart.plotHeight * 0.75) * pr;
            const sample = ctx.getImageData(
                Math.floor(px),
                Math.floor(py),
                20,
                20
            );
            let hasContent = false;
            for (let i = 3; i < sample.data.length; i += 4) {
                if (sample.data[i] > 10) {
                    hasContent = true;
                    break;
                }
            }

            return {
                ok: dimsOk && hasContent,
                dimsOk,
                hasContentInBottomRight: hasContent,
                canvasWidth: canvas.width,
                canvasHeight: canvas.height,
                expectedWidth: expectedW,
                expectedHeight: expectedH
            };
        });

        expect(
            result.dimsOk,
            `Boost canvas should be ${result.expectedWidth}x${result.expectedHeight}, got ${result.canvasWidth}x${result.canvasHeight}`
        ).toBe(true);
        expect(
            result.hasContentInBottomRight,
            'Boost should render content in bottom-right (full chart), not only top-left quarter'
        ).toBe(true);
    });
});
