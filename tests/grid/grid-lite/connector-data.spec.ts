import { test, expect } from '~/fixtures.ts';

const gridLiteHtml = `
<!DOCTYPE html>
<html>
    <head>
        <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
        <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css"></link>
    </head>
    <body>
        <div id="container"></div>
    </body>
</html>
`;

test.describe('Connector data', () => {
    test('Renders data from CSV connector', async ({ page }) => {
        await page.goto('/grid-lite/e2e/connector-data/');

        const productCell = page.locator(
            '.hcg-row[data-row-index="0"] > td[data-column-id="product"]'
        );
        const weightCell = page.locator(
            '.hcg-row[data-row-index="0"] > td[data-column-id="weight"]'
        );

        await expect(productCell).toContainText('Apples');
        await expect(weightCell).toContainText('100');
    });

    test('Uses the connector table matching dataTableKey', async ({ page }) => {
        await page.setContent(gridLiteHtml, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const grid = await (window as any).Grid.grid('container', {
                data: {
                    connector: {
                        type: 'JSON',
                        data: {
                            first: [
                                ['Name'],
                                ['Wrong table']
                            ],
                            second: [
                                ['Name'],
                                ['Selected table']
                            ]
                        },
                        dataTables: [{
                            key: 'first',
                            beforeParse: (data: any): string[][] => data.first
                        }, {
                            key: 'second',
                            beforeParse: (data: any): string[][] => data.second
                        }]
                    },
                    dataTableKey: 'second',
                    idColumn: 'Name'
                }
            }, true);

            return {
                value: await grid.dataProvider.getValue('Name', 0),
                rowIndex: await grid.dataProvider.getRowIndex(
                    'Selected table'
                )
            };
        });

        expect(result.value).toBe('Selected table');
        expect(result.rowIndex).toBe(0);
    });

    test('Polls after loading the connector table', async ({ page }) => {
        await page.setContent(gridLiteHtml, { waitUntil: 'networkidle' });

        const initialValue = await page.evaluate(async () => {
            const Grid = (window as any).Grid;

            class PollingConnector extends Grid.DataConnector {
                loadCount = 0;

                load() {
                    this.loadCount++;
                    this.getTable('selected').setColumns({
                        id: ['row-1'],
                        value: [this.loadCount]
                    });
                    this.emit({ type: 'afterLoad' });

                    return Promise.resolve(this);
                }
            }

            Grid.DataConnector.registerType(
                'PollingConnector',
                PollingConnector
            );

            const grid = await Grid.grid('container', {
                data: {
                    connector: {
                        type: 'PollingConnector',
                        dataTables: [{
                            key: 'selected'
                        }],
                        enablePolling: true,
                        dataRefreshRate: 1
                    },
                    dataTableKey: 'selected',
                    idColumn: 'id',
                    updateOnChange: true
                },
                columns: [{
                    id: 'value'
                }]
            }, true);

            (window as any).grid = grid;

            return grid.dataProvider.getValue('value', 0);
        });

        expect(initialValue).toBe(1);

        await expect.poll(() => page.evaluate(() => (
            (window as any).grid.dataProvider.getValue('value', 0)
        )), {
            timeout: 2500
        }).toBe(2);
    });
});
