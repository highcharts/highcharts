import { test, expect } from '~/fixtures.ts';
import {
    trigger,
    useSharedPage,
    waitForChart
} from '../helpers.ts';

test.describe('Highlight sync after sorting grid column.', () => {
    const getPage = useSharedPage('/dashboards/cypress/component-grid');

    test('Sorted grid should synchronize correct rows with chart\'s points.', async () => {
        const page = getPage();

        await page.locator('th[data-column-id="Vitamin A"]').click();
        await trigger(page.locator('tr[data-row-index="0"] td[data-column-id="Vitamin A"]'), 'mouseover');

        await waitForChart(page);
        const series = await page.evaluate(() => {
            const points = Highcharts.charts[0].series[0].points;
            return {
                values: points.map(p => p.y),
                eighthState: points[7].state
            };
        });

        expect(series.values, 'Chart data should not be sorted.').toEqual(
            [6421, 2122, 1350, 388, 214, 180, 140, 60, 60, 120, 120, 157]
        );
        expect(series.eighthState, 'The 8th point should be highlighted.')
            .toBe('hover');
    });
});
