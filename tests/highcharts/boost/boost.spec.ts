import { test, expect, createChart } from '~/fixtures.ts';

// Equivalent of test/typescript-karma/masters/modules/boost.test.js

const boostModules = { modules: ['modules/boost.src.js'] };

test.describe('Boost Module', () => {
    test('Highcharts boost composition', async ({ page }) => {
        await createChart(
            page,
            { series: [{ type: 'line', data: [1, 2, 3] }] },
            boostModules
        );

        const result = await page.evaluate(() => ({
            hasWebGLSupport:
                typeof (window as any).Highcharts?.hasWebGLSupport === 'function'
        }));

        expect(
            result.hasWebGLSupport,
            'Highcharts should be decorated with boost functions.'
        ).toBe(true);
    });

    test('Boost module creates chart with large data', async ({ page }) => {
        const data = Array.from({ length: 10000 }, () => Math.random() * 100);

        const chart = await createChart(
            page,
            {
                boost: {
                    useGPUTranslations: true,
                    seriesThreshold: 1
                },
                series: [{
                    type: 'line',
                    data,
                    boostThreshold: 1
                }],
                chart: { animation: false }
            },
            boostModules
        );

        const result = await chart.evaluate((c) => {
            const s = c.series[0];
            return {
                chartExists: !!c,
                seriesExists: !!s,
                dataLength: (s.options as any).data?.length ?? 0,
                isBoosted: (s as any).boosted === true
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
        const data = Array.from({ length: 100000 }, (_, i) => [
            i,
            Math.sin(i / 500) * 10 + Math.random() * 5
        ]);

        const chart = await createChart(
            page,
            {
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
            },
            {
                ...boostModules,
                css: '#container { width: 600px; height: 400px; }'
            }
        );

        await new Promise((r) => setTimeout(r, 500));

        const result = await chart.evaluate((c) => {
            const canvas = (c as any).boost?.canvas;
            if (!canvas) {
                return { ok: false, reason: 'no boost canvas' };
            }

            const expectedW = c.chartWidth * 2;
            const expectedH = c.chartHeight * 2;
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
            const px = (c.plotLeft + c.plotWidth * 0.75) * pr;
            const py = (c.plotTop + c.plotHeight * 0.75) * pr;
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
