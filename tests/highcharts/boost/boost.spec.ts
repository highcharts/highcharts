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

    test('Boost follows device pixel ratio changes', async ({ page }) => {
        const chart = await createChart(
            page,
            {
                chart: { animation: false },
                series: [{
                    type: 'line',
                    data: [1, 2, 3],
                    boostThreshold: 10
                }]
            },
            boostModules
        );

        await page.evaluate(() => {
            let pixelRatio = 2;

            const queries: Array<{
                matches: boolean;
                mediaQuery: MediaQueryList;
            }> = [];

            Object.defineProperty(window, 'devicePixelRatio', {
                configurable: true,
                get: (): number => pixelRatio
            });
            Object.defineProperty(window, 'matchMedia', {
                configurable: true,
                value: (query: string): MediaQueryList => {
                    const target = new EventTarget(),
                        getMatches = (): boolean => query ===
                            `(resolution: ${pixelRatio}dppx)`;

                    Object.defineProperties(target, {
                        matches: { get: getMatches },
                        media: { value: query },
                        onchange: { value: null, writable: true }
                    });

                    const mediaQuery = target as unknown as MediaQueryList;
                    queries.push({
                        matches: getMatches(),
                        mediaQuery
                    });
                    return mediaQuery;
                }
            });

            (window as any).setDevicePixelRatio = (ratio: number): void => {
                pixelRatio = ratio;
                queries.forEach((query): void => {
                    const matches = query.mediaQuery.matches;
                    if (matches !== query.matches) {
                        query.matches = matches;
                        query.mediaQuery.dispatchEvent(new Event('change'));
                    }
                });
            };
        });

        await chart.evaluate((c): void => {
            c.series[0].update({ boostThreshold: 1 });
        });

        const chartSize = await chart.evaluate((c) => ({
                height: c.chartHeight,
                width: c.chartWidth
            })),
            canvasSize = (): Promise<Array<number>> => chart.evaluate((c) => {
                const canvas = (c as any).boost?.canvas ||
                    (c.series[0] as any).boost?.canvas;
                return [canvas?.width, canvas?.height];
            });

        await expect.poll(canvasSize).toEqual([
            chartSize.width * 2,
            chartSize.height * 2
        ]);

        await page.evaluate((): void => {
            (window as any).setDevicePixelRatio(3);
        });
        await expect.poll(canvasSize).toEqual([
            chartSize.width * 3,
            chartSize.height * 3
        ]);

        await page.evaluate((): void => {
            (window as any).setDevicePixelRatio(1);
        });
        await expect.poll(canvasSize).toEqual([
            chartSize.width,
            chartSize.height
        ]);
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
