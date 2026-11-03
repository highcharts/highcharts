import { test, expect } from '~/fixtures.ts';
import { useSharedPage } from '~/helpers.ts';
import { waitForBoardRendered } from '../helpers.ts';

test.describe('Crossfilter with affectNavigator option', () => {
    const getPage = useSharedPage(
        '/dashboards/components/crossfilter-affecting-navigators'
    );

    test('dashboard should be rendered', async () => {
        await waitForBoardRendered(getPage());
    });

    test('should modify a table and crossfilters content', async () => {
        const page = getPage();

        await page.setViewportSize({ width: 1000, height: 660 });

        /**
         * An array of objects specifying:
         *  - handle - index handle element in the navigator we want to drag,
         *  - pageX - absolute X position to which the handle is to be dragged.
         */
        const moves = [{
            handle: 0, // 1st navigator, right handle
            pageX: 250
        }, {
            handle: 1, // 1st navigator, left handle
            pageX: 200
        }, {
            handle: 4, // 3rd navigator, right handle
            pageX: 800
        }, {
            handle: 5, // 3rd navigator, left handle
            pageX: 770
        }];

        for (const { handle, pageX } of moves) {
            const handleElement = page
                .locator('.highcharts-navigator-handle')
                .nth(handle);

            await handleElement.scrollIntoViewIfNeeded();
            const box = await handleElement.boundingBox();
            if (!box) {
                throw new Error(`Navigator handle ${handle} is not visible`);
            }
            const y = box.y + box.height / 2;

            await page.mouse.move(box.x + box.width / 2, y);
            await page.mouse.down();
            await page.mouse.move(pageX, y);
            await page.mouse.up();
        }

        await expect.poll(() => page.evaluate(async () => {
            const board = (window as any).Dashboards.boards[0];
            const dataTable = await board.dataPool
                .getConnector('Economy')
                .then((connector: any) => connector.getTable());

            return dataTable.getModified().rowCount < dataTable.rowCount;
        }), 'The modified table should have less rows than the original one.')
            .toBe(true);

        const result = await page.evaluate(() => {
            const board = (window as any).Dashboards.boards[0];

            return {
                middlePoints: board.mountedComponents[1].component.chart
                    .series[0]
                    .getColumn('y')
                    .filter((y: number | null) => y !== null).length,
                tableEvents: board.mountedComponents[0].component
                    .connectorHandlers[0].tableEvents.length
            };
        });

        expect(
            result.middlePoints,
            'The middle navigator should have less than 30 points with non null y-value.'
        ).toBeLessThan(30);
        expect(
            result.tableEvents,
            'The table events array should be cleared after the table is modified.'
        ).toBeLessThan(6);
    });
});
