import { test, expect } from '~/fixtures.ts';

test('Grid Lite capabilities expose core flags only', async ({ page }) => {
    await page.setContent(`
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
    `, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async () => {
        const Grid = (window as any).Grid;
        const grid = await Grid.grid('container', {
            columnDefaults: {
                sorting: {
                    enabled: false
                }
            },
            data: {
                columns: {
                    product: ['Pears', 'Apples'],
                    price: [2, 1]
                }
            },
            columns: [{
                id: 'product',
                filtering: {
                    enabled: true
                },
                cells: {
                    format: 'Item: {value}'
                }
            }],
            rendering: {
                header: {
                    enabled: false
                },
                rows: {
                    strictHeights: true
                },
                theme: 'hcg-custom-theme'
            }
        }, true);

        const before = { ...grid.capabilities };
        await grid.update({
            pagination: {
                enabled: true
            }
        });
        const afterUpdate = { ...grid.capabilities };

        grid.viewport?.resizeObserver?.disconnect();

        return {
            before,
            afterUpdate
        };
    });

    expect(result.before.filtering).toBe(true);
    expect(result.before.sorting).toBe(false);
    expect(result.before.pagination).toBe(false);
    expect(result.before.cellFormat).toBe(true);
    expect(result.before.strictHeights).toBe(true);
    expect(result.before.customTheme).toBe(true);
    expect(result.before.header).toBe(false);
    expect(result.before.pinning).toBe(false);
    expect(result.before.treeView).toBe(false);
    expect(result.before.editMode).toBe(false);
    expect(result.before.remoteOperations).toBe(false);
    expect(result.before.key).toBe('missing');
    expect(result.afterUpdate.pagination).toBe(true);
});
