import { test, expect } from '~/fixtures.ts';

const gridProMarkup = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
            <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
        </head>
        <body>
            <div id="container"></div>
            <div id="remote-container"></div>
        </body>
    </html>
`;

function makeGridKey(expirySegment: string): string {
    const segments = ['ABCD', 'EFGH', 'IJKL', expirySegment];
    const payload = segments.join('');
    let sum = 0;
    for (let i = 0; i < payload.length; i++) {
        sum += payload.charCodeAt(i) * (i + 1);
    }
    let checksum = (sum % 1679616).toString(36).toUpperCase();
    while (checksum.length < 4) {
        checksum = '0' + checksum;
    }
    return [...segments, checksum, '0000'].join('-');
}

test('Grid capabilities reflect effective Pro feature state', async ({
    page
}) => {
    await page.setContent(gridProMarkup, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async (gridKey) => {
        const Grid = (window as any).Grid;
        const grid = await Grid.grid('container', {
            gridKey,
            data: {
                idColumn: 'id',
                treeView: {
                    input: {
                        type: 'path',
                        pathColumn: 'path'
                    },
                    treeColumn: 'product'
                },
                columns: {
                    id: ['a', 'b'],
                    path: ['Fruit', 'Fruit/Apples'],
                    product: ['Fruit', 'Apples'],
                    price: [3, 1]
                }
            },
            columns: [{
                id: 'product',
                filtering: {
                    enabled: true
                },
                cells: {
                    editMode: {
                        enabled: true
                    },
                    format: 'Item: {value}'
                }
            }, {
                id: 'price',
                cells: {
                    formatter: function (this: any): string {
                        return String(this.value);
                    }
                }
            }],
            pagination: {
                enabled: true,
                pageSize: 1
            },
            rendering: {
                header: {
                    enabled: false
                },
                rows: {
                    strictHeights: true,
                    pinning: {
                        topIds: ['a']
                    }
                },
                theme: 'hcg-custom-theme'
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        return { ...grid.capabilities };
    }, makeGridKey('AZZZ'));

    expect(result).toStrictEqual({
        filtering: true,
        sorting: true,
        pinning: true,
        treeView: true,
        pagination: true,
        editMode: true,
        cellFormat: true,
        cellFormatter: true,
        strictHeights: true,
        customTheme: true,
        header: false,
        remoteOperations: false,
        key: 'valid'
    });
});

test('Grid capabilities track option updates and remote providers', async ({
    page
}) => {
    await page.setContent(gridProMarkup, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async (gridKeys) => {
        const Grid = (window as any).Grid;
        const key = gridKeys.valid;
        const grid = await Grid.grid('container', {
            gridKey: key,
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
            }
        }, true);

        const before = { ...grid.capabilities };
        await grid.update({
            columns: [{
                id: 'product',
                filtering: {
                    enabled: true
                }
            }],
            pagination: {
                enabled: true
            },
            rendering: {
                rows: {
                    pinning: {
                        topIds: [0]
                    }
                }
            }
        });
        const afterUpdate = { ...grid.capabilities };

        const remoteGrid = await Grid.grid('remote-container', {
            gridKey: key,
            data: {
                providerType: 'remote',
                fetchCallback: () => Promise.resolve({
                    columns: {
                        product: ['Remote row'],
                        price: [5]
                    },
                    rowIds: ['remote-0'],
                    totalRowCount: 1
                })
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();
        remoteGrid.viewport?.resizeObserver?.disconnect();

        return {
            before,
            afterUpdate,
            remote: { ...remoteGrid.capabilities },
            invalidKey: await Grid.grid(document.createElement('div'), {
                gridKey: 'invalid',
                data: {
                    columns: {
                        product: ['Apples']
                    }
                }
            }, true).then((invalidGrid: any) => invalidGrid.capabilities.key),
            expiredKey: await Grid.grid(document.createElement('div'), {
                gridKey: gridKeys.expired,
                data: {
                    columns: {
                        product: ['Apples']
                    }
                }
            }, true).then((expiredGrid: any) => expiredGrid.capabilities.key),
            missingKey: await Grid.grid(document.createElement('div'), {
                data: {
                    columns: {
                        product: ['Apples']
                    }
                }
            }, true).then((missingGrid: any) => missingGrid.capabilities.key)
        };
    }, {
        expired: makeGridKey('A000'),
        valid: makeGridKey('AZZZ')
    });

    expect(result.before.filtering).toBe(false);
    expect(result.before.pagination).toBe(false);
    expect(result.before.pinning).toBe(false);
    expect(result.before.header).toBe(true);
    expect(result.afterUpdate.filtering).toBe(true);
    expect(result.afterUpdate.pagination).toBe(true);
    expect(result.afterUpdate.pinning).toBe(true);
    expect(result.remote.remoteOperations).toBe(true);
    expect(result.invalidKey).toBe('invalid');
    expect(result.expiredKey).toBe('expired');
    expect(result.missingKey).toBe('missing');
});
