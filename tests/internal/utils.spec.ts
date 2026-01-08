import { test, expect, createChart } from '~/fixtures.ts';
import { getKarmaScripts, getSample, waitForChartsResizeComplete } from '~/utils.ts';

test('Karma scripts', async () => {
    const scripts = await getKarmaScripts();
    expect(scripts).toContain('code/highcharts.src.js');
});

test.describe('Demo folder assembly', () =>{
    test('demo.js', () => {
        const demoPath = 'samples/highcharts/demo/line-chart';
        const demo = getSample(demoPath);

        expect(demo).toHaveProperty('script');
        expect(demo).toHaveProperty('html');
        expect(demo).toHaveProperty('details');
        expect(demo).toHaveProperty('css');
    });
});

test.describe('waitForChartsResizeComplete', () => {
    test('resolves immediately when no Highcharts is loaded', async ({ page }) => {
        await page.setContent('<html><body></body></html>');

        // Should resolve without throwing
        await waitForChartsResizeComplete(page);
    });

    test('resolves immediately when no charts exist', async ({ page }) => {
        await page.setContent(`
            <html>
            <head>
                <script src="https://code.highcharts.com/highcharts.js"></script>
            </head>
            <body></body>
            </html>
        `);
        await page.waitForFunction(() => !!(window as any).Highcharts);

        // Should resolve without throwing
        await waitForChartsResizeComplete(page);
    });

    test('resolves immediately when chart is not resizing', async ({ page }) => {
        await createChart(page, {
            series: [{ type: 'line', data: [1, 2, 3] }]
        });

        // Chart should not be resizing after creation
        await waitForChartsResizeComplete(page);

        const isResizing = await page.evaluate(() => {
            return (window as any).Highcharts.charts[0]?.isResizing;
        });
        expect(isResizing).toBe(0);
    });

    test('waits for chart resize to complete after setSize()', async ({ page }) => {
        await createChart(page, {
            chart: { width: 600, height: 400 },
            series: [{ type: 'line', data: [1, 2, 3] }]
        });

        // Trigger a resize
        await page.evaluate(() => {
            (window as any).Highcharts.charts[0]?.setSize(400, 300);
        });

        // Wait for resize to complete
        await waitForChartsResizeComplete(page);

        // Verify the chart has the new dimensions
        const dimensions = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                width: chart?.chartWidth,
                height: chart?.chartHeight,
                isResizing: chart?.isResizing
            };
        });

        expect(dimensions.width).toBe(400);
        expect(dimensions.height).toBe(300);
        expect(dimensions.isResizing).toBe(0);
    });

    test('waits for chart reflow after viewport resize', async ({ page }) => {
        await createChart(page, {
            chart: { reflow: true },
            series: [{ type: 'line', data: [1, 2, 3] }]
        });

        // Resize viewport
        await page.setViewportSize({ width: 500, height: 400 });

        // Wait for resize to complete
        await waitForChartsResizeComplete(page);

        // Verify chart has reflowed
        const finalState = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                width: chart?.chartWidth,
                isResizing: chart?.isResizing
            };
        });

        expect(finalState.isResizing).toBe(0);
        // Chart width should have changed to fit the new viewport
        expect(finalState.width).toBeLessThanOrEqual(500);
    });

    test('waits for multiple charts to finish resizing', async ({ page }) => {
        // Create two charts
        await page.setContent(`
            <html>
            <head>
                <script src="https://code.highcharts.com/highcharts.js"></script>
            </head>
            <body>
                <div id="container1" style="width: 600px; height: 400px;"></div>
                <div id="container2" style="width: 600px; height: 400px;"></div>
            </body>
            </html>
        `);
        await page.waitForFunction(() => !!(window as any).Highcharts);

        await page.evaluate(() => {
            (window as any).Highcharts.chart('container1', {
                series: [{ type: 'line', data: [1, 2, 3] }]
            });
            (window as any).Highcharts.chart('container2', {
                series: [{ type: 'line', data: [4, 5, 6] }]
            });
        });

        // Trigger resize on both charts
        await page.evaluate(() => {
            (window as any).Highcharts.charts[0]?.setSize(400, 300);
            (window as any).Highcharts.charts[1]?.setSize(350, 250);
        });

        // Wait for all charts to finish resizing
        await waitForChartsResizeComplete(page);

        // Verify both charts have finished resizing
        const states = await page.evaluate(() => {
            return (window as any).Highcharts.charts.filter(Boolean).map(
                (chart: any) => ({
                    isResizing: chart.isResizing
                })
            );
        });

        expect(states).toHaveLength(2);
        expect(states[0].isResizing).toBe(0);
        expect(states[1].isResizing).toBe(0);
    });

    test('respects timeout option', async ({ page }) => {
        await createChart(page, {
            chart: { width: 600, height: 400 },
            series: [{ type: 'line', data: [1, 2, 3] }]
        });

        // Manually set isResizing to simulate a stuck resize (for testing timeout)
        await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            if (chart) {
                chart.isResizing = 1;
            }
        });

        // Should timeout and reject
        await expect(
            waitForChartsResizeComplete(page, { timeout: 100 })
        ).rejects.toThrow('Timeout waiting for charts to finish resizing');
    });
});
