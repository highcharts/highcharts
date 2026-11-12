import { test, expect } from '~/fixtures.ts';
import { useSharedPage } from '~/helpers.ts';

test.describe('3D area', () => {
    const getPage = useSharedPage(
        '/highcharts/3d/area',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('There should be a chart', async () => {
        expect(
            await getPage().evaluate(() => Highcharts.charts.length)
        ).toBeGreaterThanOrEqual(1);
    });

    test('clicking a legend item should hide it and the series', async () => {
        const page = getPage();
        const legendItem = page.locator('.highcharts-legend-item');
        const series = page.locator('.highcharts-series').first();

        await legendItem.click();
        await expect(legendItem)
            .toHaveClass(/\bhighcharts-legend-item-hidden\b/);
        await expect(series).toHaveAttribute('visibility', 'hidden');

        await legendItem.click();
        await expect(series).not.toHaveAttribute('visibility');
    });
});
