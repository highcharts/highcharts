import { test, expect } from '~/fixtures.ts';
import {
    dropComponent,
    grabComponent,
    toggleEditMode,
    useSharedPage,
    waitForBoard
} from '../helpers.ts';

test.describe('Component loading', () => {
    const getPage = useSharedPage('/dashboards/cypress/component-loading/');

    test('image should be within parent cell', async () => {
        const boxes = await getPage().locator('#dashboard-col-3')
            .evaluate(cell => ({
                cell: cell.getBoundingClientRect().toJSON(),
                image: cell.querySelector('img')?.getBoundingClientRect().toJSON()
            }));

        expect(boxes.image, 'Failed to find the image').toBeDefined();
        expect(
            boxes.cell.width,
            'The width of image is smaller than cell'
        ).toBeGreaterThan(boxes.image.width);
        expect(
            boxes.cell.height,
            'The height of image is smaller than cell'
        ).toBeGreaterThan(boxes.image.height);
    });
});

test.describe('Caption', () => {
    const getPage = useSharedPage('/dashboards/component-options/caption/');

    test('Caption should be visible when title exists (#20557).', async () => {
        await expect(getPage().locator(
            '#dashboard-col-0 .highcharts-dashboards-component-caption'
        )).toBeVisible();
    });
});

test.describe('Data polling restarting', () => {
    const getPage = useSharedPage('/dashboards/cypress/connector-polling');

    test.beforeAll(async () => {
        await toggleEditMode(getPage());
    });

    test('Should restart the connector polling.', async () => {
        const page = getPage();

        await waitForBoard(page);
        const destroyed = await page.evaluate(async () => {
            const dashboard = (window as any).Dashboards.boards[0];
            const connector =
                await dashboard.dataPool.getConnector('fetched-data');
            const signal = connector.pollingController.signal;
            const before = {
                components: connector.components?.length,
                aborted: signal.aborted,
                polling: connector.polling
            };

            // Destroy the component.
            dashboard.mountedComponents[0].component.destroy();

            return {
                before,
                after: {
                    components: connector.components,
                    aborted: signal.aborted,
                    polling: connector.polling
                }
            };
        });

        // Component reference should be initially added to the connector.
        expect(destroyed.before.components).toBeGreaterThan(0);
        // Expect request not to be aborted.
        expect(destroyed.before.aborted).toBe(false);
        // Connector polling should be run initially.
        expect(destroyed.before.polling).toBe(true);

        // Component reference should be removed from the connector.
        expect(destroyed.after.components).toBeUndefined();
        // Expect request to be aborted.
        expect(destroyed.after.aborted).toBe(true);
        // Connector polling should be stopped.
        expect(destroyed.after.polling).toBe(false);

        // Add a new chart component.
        await grabComponent(page, 'chart');
        await dropComponent(page, '#dashboard-col-0');

        await expect.poll(() => page.evaluate(async () => {
            const dashboard = (window as any).Dashboards.boards[0];
            const connector =
                await dashboard.dataPool.getConnector('fetched-data');

            return {
                components: connector.components?.length > 0,
                aborted: connector.pollingController.signal.aborted,
                polling: connector.polling
            };
        }), 'Connector polling should run again').toEqual({
            components: true,
            aborted: false,
            polling: true
        });
    });
});

test.describe('Data polling stop', () => {
    const getPage = useSharedPage('/dashboards/cypress/connector-polling');

    test('Connector polling is stopped after the unloaded board is destroyed.', async () => {
        const page = getPage();

        await waitForBoard(page);
        expect(
            await page.evaluate(() => {
                const dashboard = (window as any).Dashboards.boards[0];
                const CONNECTOR_ID = 'fetched-data';
                const dataPool = dashboard.dataPool;

                // Let the connector to load synchronously.
                dataPool.getConnector(CONNECTOR_ID);
                // Destroy the dashboard before the connector gets loaded.
                dashboard.destroy();

                return dataPool.connectors[CONNECTOR_ID]
                    .pollingController.signal.aborted;
            }),
            'Expect request to be aborted.'
        ).toBe(true);
    });
});
