import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForBoard } from '../helpers.ts';

test.describe('Remove the dashboard.', () => {
    const getPage = useSharedPage('/dashboards/cypress/component-grid');

    test('Dashboard should be removed without errors', async () => {
        const page = getPage();

        await waitForBoard(page);
        await page.evaluate(() => {
            (window as any).Dashboards.boards[0].destroy();
        });

        await expect(page.locator('.highcharts-dashboards-wrapper'))
            .toHaveCount(0);
        await expect(page.locator('#container')).toBeAttached();
    });
});
