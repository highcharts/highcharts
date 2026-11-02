import { test, expect } from '~/fixtures.ts';
import {
    trigger,
    useSharedPage,
    waitForBoardRendered,
    waitForChart
} from '../helpers.ts';

test.describe('Sync when new connector added to components.', () => {
    const getPage = useSharedPage(
        '/dashboards/cypress/component-with-no-connector'
    );

    test('Chart and GridComponent should have synced hover events.', async () => {
        const page = getPage();
        const firstCell = page.locator('tr.hcg-row').nth(0);

        // Hover over GridComponent.
        await trigger(firstCell, 'mouseover');
        await expect(firstCell).toHaveClass(/\bhcg-hovered-row\b/);

        await waitForChart(page);
        expect(
            await page.evaluate(
                () => (Highcharts.charts[0] as any).tooltip.isHidden
            ),
            'When hovering over Grid, chart should have tooltip.'
        ).toBeFalsy();
    });
});

test.describe('Sync groups for the same connectors.', () => {
    const getPage = useSharedPage('/dashboards/sync/groups');

    test('Components should be synced only inside the same group.', async () => {
        const items = getPage().locator('.highcharts-legend-item');

        await items.nth(0).click();
        await expect(items.nth(1)).toHaveClass(/highcharts-legend-item-hidden/);
        await expect(items.nth(2)).not.toHaveClass(/highcharts-legend-item-hidden/);
    });

    test('Group can be toggled by updating a component.', async () => {
        const page = getPage();
        const items = page.locator('.highcharts-legend-item');

        await items.nth(2).click();
        await page.locator('#s3').selectOption('First Group');
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(100);
        await items.nth(2).click();
        await expect(items.nth(1)).not.toHaveClass(/highcharts-legend-item-hidden/);
        await expect(items.nth(3)).toHaveClass(/highcharts-legend-item-hidden/);
    });
});

test.describe('Highlight sync after destroying a component.', () => {
    const getPage = useSharedPage('/dashboards/sync/highlight-after-destroy');

    // Known failure: the sample is missing from the repository
    test.fail('#25082, should unregister highlight on the component table.', async () => {
        const page = getPage();

        await waitForBoardRendered(page);

        const counts = await page.evaluate(() => {
            const board = (window as any).Dashboards.boards[0];
            const table = board.mountedComponents[0].component.getDataTable();
            const getCount = () => (
                board.dataCursor.listenerMap[table.id]?.['point.mouseOver'] ||
                []
            ).length;

            const before = getCount();
            board.mountedComponents[1].cell.destroy();
            const after = getCount();

            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 0,
                column: 'Vitamin A',
                state: 'point.mouseOver',
                sourceId: 'test'
            });

            return { before, after };
        });

        expect(
            counts.after,
            'Highlight listener should be removed from the component table.'
        ).toBe(counts.before - 1);
    });
});
