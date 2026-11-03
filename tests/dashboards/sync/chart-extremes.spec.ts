import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { panChart, useSharedPage, zoomChart } from '~/helpers.ts';
import { waitForBoardRendered } from '../helpers.ts';

/**
 * Tests that all charts have the same min and max values on their first x and
 * y axis as the first chart.
 */
async function expectSyncedAxes(page: Page): Promise<void> {
    const axes = await page.evaluate(() => Highcharts.charts.map(chart => ({
        xAxes: chart.xAxis.length,
        yAxes: chart.yAxis.length,
        x: [chart.xAxis[0].min, chart.xAxis[0].max],
        y: [chart.yAxis[0].min, chart.yAxis[0].max]
    })));

    expect(axes.length).toBeGreaterThan(0);
    for (const chartAxes of axes) {
        expect(chartAxes.xAxes).toBe(1);
        expect(chartAxes.yAxes).toBe(1);
        expect(chartAxes.x).toEqual(axes[0].x);
        expect(chartAxes.y).toEqual(axes[0].y);
        for (const value of [...chartAxes.x, ...chartAxes.y]) {
            expect(value).toBeDefined();
        }
    }
}

test.describe('Chart extremes sync', () => {
    const getPage = useSharedPage('/dashboards/cypress/sync-chart-extremes');

    test('Dashboard should be rendered', async () => {
        await waitForBoardRendered(getPage());
    });

    /**
     * Notes:
     *  In this sample all the series comes from the same data table,
     *  without any special tinkering, so there should be no issues with
     *  varying data sizes between axes.
     */

    test('should sync selection', async () => {
        const page = getPage();
        const firstChart = page.locator('.highcharts-container').first();

        await zoomChart(firstChart);

        // All charts should now have
        await expect(page.locator('.highcharts-reset-zoom')).toHaveCount(3);

        expect(await page.evaluate(() => Highcharts.charts.every(
            chart => chart.resetZoomButton !== void 0
        ))).toBe(true);
        await expectSyncedAxes(page);

        // Click on reset in the first chart
        await firstChart.locator('.highcharts-reset-zoom').click();

        // TODO: update to test that other charts do/don't reset
        await expect.poll(() => page.evaluate(
            () => Highcharts.charts[0].resetZoomButton
        )).toBeUndefined();
    });

    test('should sync panning', async () => {
        const page = getPage();
        const firstChart = page.locator('.highcharts-container').first();

        await zoomChart(firstChart);
        await expectSyncedAxes(page);

        // Do the pan
        await panChart(firstChart);
        await expectSyncedAxes(page);
    });
});

test.describe('Chart extreme sync zooming when min or max stays the same', () => {
    const getPage = useSharedPage('/dashboards/demo/sync-extremes');

    test('All charts should be synced', async () => {
        const page = getPage();

        await waitForBoardRendered(page);

        const extremes = await page.evaluate(() => {
            const board = (window as any).Dashboards.boards[0];
            const chart = board.mountedComponents[0].component.chart,
                chart2 = board.mountedComponents[1].component.chart;

            chart.xAxis[0].setExtremes(0, 5);

            return [chart, chart2].map(c => [c.xAxis[0].min, c.xAxis[0].max]);
        });

        expect(
            extremes[1][0],
            'X-axis min should be equal in both charts.'
        ).toBeCloseTo(extremes[0][0], 0);
        expect(
            extremes[1][1],
            'X-axis max should be equal in both charts.'
        ).toBeCloseTo(extremes[0][1], 0);
    });
});
