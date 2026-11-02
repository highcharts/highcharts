import { test, expect } from '~/fixtures.ts';
import { trigger, useSharedPage, waitForChart } from '../../helpers.ts';

test.describe('Multiple connectors', () => {
    const getPage = useSharedPage(
        '/dashboards/highcharts-components/multiple-connectors'
    );

    test('Should render series from multiple connectors.', async () => {
        const page = getPage();

        await expect(page.locator('.highcharts-series.highcharts-series-1 > *'))
            .toHaveCount(5);
        await expect(page.locator('.highcharts-series.highcharts-series-3 > *'))
            .toHaveCount(3);
    });

    test('Should highlight series from multiple connectors.', async () => {
        const page = getPage();

        await trigger(
            page.locator('#dashboard-col-2 tr.hcg-row').first(),
            'mouseover'
        );

        await waitForChart(page);
        expect(
            await page.evaluate(
                () => Highcharts.charts[0].series[3].points[0].state
            ),
            'When hovering over Grid, pie should have point hovered.'
        ).toBe('hover');
    });
});

test.describe('Highlight sync affected series id option (with Grid)', () => {
    const getPage = useSharedPage(
        '/dashboards/sync/highcharts-highlight-affected-series'
    );

    test('Should highlight the proper series when affected series id is defined.', async () => {
        const page = getPage();

        await page.locator('#radio-2022').click({ force: true });
        await trigger(
            page.locator('#dashboard-col-1 tr.hcg-row').first(),
            'mouseover'
        );

        await waitForChart(page);
        expect(
            await page.evaluate(
                () => Highcharts.charts[0].series[2].points[0].state
            ),
            'Affected series id is set to 2022.'
        ).toBe('hover');
    });
});
