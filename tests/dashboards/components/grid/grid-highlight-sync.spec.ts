import { test, expect } from '~/fixtures.ts';
import { testViewport } from '~/helpers.ts';
import { waitForBoard } from '../../helpers.ts';

test.use({ viewport: testViewport });

test.describe('Grid Component highlight sync autoscroll', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/sync/grid-highlight-sync-autoscroll');
        await waitForBoard(page);
    });

    test('Grid AutoScroll should work', async ({ page }) => {
        await page.evaluate(() => {
            const board = (window as any).Dashboards.boards[0];
            const table = board.dataPool.connectors.data.getTable();

            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 50,
                column: 'Rate',
                state: 'point.mouseOver'
            });
        });

        await expect(
            page.locator('.hcg-row.hcg-synced-row > *').first()
        ).toHaveText('2015-07-15');
    });

    test('Grid AutoScroll should be possible to disable', async ({ page }) => {
        await page.evaluate(() => {
            const board = (window as any).Dashboards.boards[0];

            board.mountedComponents[1].component.update({
                sync: {
                    highlight: {
                        enabled: true,
                        autoScroll: false
                    }
                }
            });

            const table = board.dataPool.connectors.data.getTable();
            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 50,
                column: 'Rate',
                state: 'point.mouseOver'
            });
        });

        await expect(page.locator('tr.hcg-row > *').first())
            .toHaveText('2015-05-06');
    });
});
