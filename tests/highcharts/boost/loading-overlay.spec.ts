import { test, expect } from '~/fixtures.ts';

test('Canvas boost loading timers are isolated per chart', async ({ page }) => {
    await page.setContent(`
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/boost-canvas.js"></script>
        <script>window.WebGLRenderingContext = void 0;</script>
        <script src="https://code.highcharts.com/modules/boost.js"></script>
        <div id="first-container"></div>
        <div id="second-container"></div>
    `, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async () => {
        const Highcharts = (window as any).Highcharts,
            data = Array.from({ length: 100000 }, (_, i) => i % 100);

        let firstRendered: () => void;
        const firstRenderedPromise = new Promise<void>((resolve) => {
            firstRendered = resolve;
        });
        const getOptions = (rendered: () => void) => ({
            chart: {
                animation: false
            },
            plotOptions: {
                series: {
                    boostThreshold: 1,
                    events: {
                        renderedCanvas: rendered
                    }
                }
            },
            series: [{ data }]
        });

        const firstChart = Highcharts.chart(
            'first-container',
            getOptions(() => firstRendered())
        );

        await firstRenderedPromise;

        const firstLoadingDiv = firstChart.loadingDiv,
            secondChart = Highcharts.chart(
                'second-container',
                getOptions(() => void 0)
            );

        await new Promise((resolve) => setTimeout(resolve, 400));

        const state = {
            firstLoadingDivConnected: firstLoadingDiv.isConnected,
            firstLoadingRemoved: firstChart.loadingDiv === null,
            webGLSupported: Highcharts.hasWebGLSupport()
        };

        firstChart.destroy();
        secondChart.destroy();

        return state;
    });

    expect(result.webGLSupported).toBe(false);
    expect(result.firstLoadingDivConnected).toBe(false);
    expect(result.firstLoadingRemoved).toBe(true);
});
