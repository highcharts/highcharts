import { test, expect } from '~/fixtures.ts';
import { testViewport, waitForBoard } from './helpers.ts';

const CONNECTOR_ID = 'data-connector';
const DATA_TABLE_KEY = 'kpis';

test.use({ viewport: testViewport });

test.describe('Multiple dataTables rendering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/multiple-datatables');
        await waitForBoard(page);
    });

    test('Render multiple dataTables.', async ({ page }) => {
        const result = await page.evaluate(({
            CONNECTOR_ID,
            DATA_TABLE_KEY
        }) => {
            const connector = (window as any).Dashboards.boards[0].dataPool
                .connectors[CONNECTOR_ID];
            const dataTables = Object.values(connector.dataTables);

            return {
                count: dataTables.length,
                first: connector.getTable() === dataTables[0],
                byKey: connector.getTable(DATA_TABLE_KEY) ===
                    connector.dataTables[DATA_TABLE_KEY]
            };
        }, { CONNECTOR_ID, DATA_TABLE_KEY });

        expect(result.count, 'Should render a proper dataTables amount.')
            .toBe(2);
        expect(
            result.first,
            'Should retrieve a proper first dataTable instance.'
        ).toBe(true);
        expect(
            result.byKey,
            'Should retrieve a proper dataTable instance based on key.'
        ).toBe(true);
    });

    test('Adjust multiple dataTables.', async ({ page }) => {
        const result = await page.evaluate(({
            CONNECTOR_ID,
            DATA_TABLE_KEY
        }) => {
            const dataPool = (window as any).Dashboards.boards[0].dataPool;
            const options = dataPool.options.connectors
                .find((connector: any) => connector.id === CONNECTOR_ID)
                .dataTables
                .find((table: any) => table.key === DATA_TABLE_KEY);
            const table =
                dataPool.connectors[CONNECTOR_ID].getTable(DATA_TABLE_KEY);

            return {
                columnIds: [options.columnIds, table.getColumnIds()],
                modifier: [
                    options.dataModifier.type,
                    table.modifier.options.type
                ]
            };
        }, { CONNECTOR_ID, DATA_TABLE_KEY });

        expect(
            result.columnIds[1],
            'The dataTable columnIds option should match the user options.'
        ).toEqual(result.columnIds[0]);
        expect(
            result.modifier[1],
            'The dataTable dataModifier option should match the user options.'
        ).toEqual(result.modifier[0]);
    });

    test('Should get the proper dataTable for a component.', async ({ page }) => {
        const pairs = await page.evaluate(CONNECTOR_ID => {
            const connector = (window as any).Dashboards.boards[0].dataPool
                .connectors[CONNECTOR_ID];

            return connector.components.map((component: any) => [
                connector.dataTables[
                    component.connectorHandlers[0].options.dataTableKey
                ].columns,
                component.getDataTable().columns
            ]);
        }, CONNECTOR_ID);

        for (const [expected, actual] of pairs) {
            expect(
                actual,
                'The component dataTable columns should match based on the provided data table key.'
            ).toEqual(expected);
        }
    });
});
