import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForChart } from '~/helpers.ts';

test.describe('Drilldown with point mouseOver', () => {
    const getPage = useSharedPage('/highcharts/e2e/drilldown');

    test('#21534, Should drill down even if point mouseOver is defined', async () => {
        const page = getPage();

        await waitForChart(page);
        const [x, y] = await page.evaluate(() => {
            const chart = Highcharts.charts[0];
            return [
                chart.plotLeft + (chart.plotWidth / 2) - 50,
                chart.plotTop + (chart.plotHeight / 2) + 100
            ];
        });

        await page.locator('#container').click({ position: { x, y } });

        await expect.poll(
            () => page.evaluate(() => {
                const point = Highcharts.charts[0].series[0].points[0];
                return [point.name, point.y];
            }),
            'Points should change after drilldown'
        ).toEqual(['d', 4]);
    });
});
