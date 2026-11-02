import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForBoardRendered } from '../helpers.ts';

test.describe('Remove the dashboard.', () => {
    const getPage = useSharedPage('/dashboards/cypress/chart-series-visibility');

    test('Dashboard should be rendered', async () => {
        await waitForBoardRendered(getPage());
    });

    test('should synchronize visible series between two charts sharing the same store', async () => {
        const page = getPage();

        // There should be no hidden legend items
        await expect(page.locator('.highcharts-legend-item-hidden'))
            .toHaveCount(0);

        const hiddenItem = page.locator('.highcharts-legend-item').last();
        await hiddenItem.click();
        const value = await hiddenItem.textContent();

        // Hidden legend items in other charts should match
        const charts = await page.locator('.chart-container').all();
        expect(charts.length).toBeGreaterThan(0);
        for (const chart of charts) {
            await expect(chart.locator('.highcharts-legend-item-hidden'))
                .toHaveText(value ?? '');
        }
    });
});
