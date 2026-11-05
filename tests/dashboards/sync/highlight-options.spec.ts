import { test, expect } from '~/fixtures.ts';
import { trigger, useSharedPage, waitForChart } from '~/helpers.ts';
import { waitForBoardRendered } from '../helpers.ts';

test.describe('Highlight sync options', () => {
    const getPage = useSharedPage('/dashboards/sync/sync-highlight-options');

    test('All chart highlight sync options are disabled', async () => {
        const page = getPage();

        await waitForBoardRendered(page);

        await page.locator('#cbx-chart-showTooltip').click();
        await page.locator('#cbx-chart-highlightPoint').click();
        await page.locator('#cbx-chart-showCrosshair').click();

        await trigger(page.locator('tr.hcg-row').nth(0), 'mouseover');

        await waitForChart(page);
        const chart = await page.evaluate(() => {
            const chart = Highcharts.charts[0] as any;
            return {
                tooltipHidden: chart.tooltip.isHidden,
                pointState: chart.series[0].points[0].state,
                crossOpacity: chart.yAxis[0].cross?.opacity
            };
        });

        expect(
            chart.tooltipHidden,
            'When hovering over Grid, chart should not have tooltip.'
        ).toBeTruthy();
        expect(
            chart.pointState === 'hover',
            'When hovering over Grid, chart should not have marker.'
        ).toBeFalsy();
        expect(
            chart.crossOpacity === 1,
            'When hovering over Grid, chart should not have crosshair.'
        ).toBeFalsy();
    });

    test('Chart highlight showTooltip option is enabled', async () => {
        const page = getPage();

        await page.locator('#cbx-chart-showTooltip').click();

        await trigger(page.locator('tr.hcg-row').nth(1), 'mouseover');

        await waitForChart(page);
        expect(
            await page.evaluate(
                () => (Highcharts.charts[0] as any).tooltip.isHidden
            ),
            'When hovering over Grid, chart should have tooltip.'
        ).toBeFalsy();
    });

    test('Chart highlight highlightPoint option is enabled', async () => {
        const page = getPage();

        await page.locator('#cbx-chart-highlightPoint').click();

        await trigger(page.locator('tr.hcg-row').nth(2), 'mouseover');

        await waitForChart(page);
        expect(
            await page.evaluate(
                () => Highcharts.charts[0].series[0].points[2].state
            ),
            'When hovering over Grid, chart should have marker hovered.'
        ).toBe('hover');
    });

    test('Chart highlight showCrosshair option is enabled', async () => {
        const page = getPage();

        await page.locator('#cbx-chart-showCrosshair').click();

        await trigger(page.locator('tr.hcg-row').nth(3), 'mouseover');

        await waitForChart(page);
        expect(
            await page.evaluate(
                () => (Highcharts.charts[0].yAxis[0] as any).cross?.opacity
            ),
            'When hovering over Grid, chart should have crosshair.'
        ).toBe(1);
    });

    // Known failure, also before the move to Playwright
    test.fail('Chart highlight sync is disabled', async () => {
        const page = getPage();

        await page.locator('#cbx-chart-enabled').click();

        await trigger(page.locator('tr.hcg-row').nth(4), 'mouseover');

        await waitForChart(page);
        const chart = await page.evaluate(() => {
            const chart = Highcharts.charts[0] as any;
            return {
                firstPointState: chart.series[0].points[0].state,
                fifthPointState: chart.series[0].points[4].state,
                crossOpacity: chart.xAxis[0].cross &&
                    chart.yAxis[0].cross.opacity
            };
        });

        expect(
            chart.firstPointState,
            'When hovering over Grid, recently hovered point should not be hovered.'
        ).not.toBe('hover');
        expect(
            chart.fifthPointState,
            'When hovering over Grid, currently hovered point should not be hovered.'
        ).not.toBe('hover');
        expect(
            chart.crossOpacity,
            'When hovering over Grid, chart should not have crosshair.'
        ).not.toBe(1);
    });

    test('Grid highlight sync is enabled', async () => {
        const page = getPage();

        await page.locator('#cbx-grid-enabled').click();

        // Highlight the row from the first grid.
        await trigger(page.locator('#grid-0 tr.hcg-row').nth(4), 'mouseover');

        // The corresponding row from the second grid should be highlighted.
        await expect(page.locator('#grid-1 tr.hcg-row').nth(4))
            .toHaveClass(/\bhcg-synced-row\b/);
    });
});
