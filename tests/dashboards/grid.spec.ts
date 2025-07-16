import { test, expect } from '../fixtures.ts';

// Equivalent of test/typescript-karma/Dashboards/Grid/grid.test.jsgrid.test.js
test('Grid update methods', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/dashboards/datagrid.src.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/dashboards/css/datagrid.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const gridHandle = await page.evaluateHandle(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return;
        }

        const grid = await Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                    weight: [100, 40, 0.5, 200],
                    price: [1.5, 2.53, 5, 4.5]
                }
            },
            columns: [{
                id: 'product',
                header: {
                    format: 'Column 1'
                },
                cells: {
                    format: 'before update'
                }
            }, {
                id: 'weight',
                header: {
                    format: 'Column 2'
                },
                cells: {
                    format: 'before update'
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        return grid;
    });

    // was an assert.ok in original
    expect(
        await gridHandle.evaluate(grid => {
            const newOptionsObject = {
                columns: [{
                    id: 'weight',
                    cells: {
                        format: 'after update'
                    }
                }, {
                    id: 'price',
                    enabled: false
                }, {
                    id: 'imaginary-column'
                }]
            };

            grid?.update(newOptionsObject, false);

            return newOptionsObject;
        }),
        'The update method should not mutate the options object passed as an argument.'
    ).toHaveProperty('columns');

    expect(
        await gridHandle.jsonValue(),
        'The update method should not mutate the options object passed as an argument.'
    ).toHaveProperty('options.columns', [{
        id: 'product',
        header: {
            format: 'Column 1'
        },
        cells: {
            format: 'before update'
        }
    }, {
        id: 'weight',
        header: {
            format: 'Column 2'
        },
        cells: {
            format: 'after update'
        }
    }, {
        id: 'price',
        enabled: false
    }]);

    expect(
        await gridHandle.evaluate(grid => {
            grid?.update({
                columns: [{
                    id: 'weight'
                }, {
                    id: 'product',
                    cells: {
                        format: 'after update'
                    }
                }]
            }, false, true);

            return grid?.options?.columns;
        }),
        'One-to-one update should remove all the column options that were not' +
        ' specified in the first argument.'
    ).toStrictEqual([
        {
            id: 'weight',
            header: {
                format: 'Column 2'
            },
            cells: {
                format: 'after update'
            }
        }, {
            id: 'product',
            header: {
                format: 'Column 1'
            },
            cells: {
                format: 'after update'
            }
        }
    ]);

    expect(
        await gridHandle.evaluate(grid => {
            grid?.updateColumn('weight', {}, false, true);
            grid?.updateColumn('product', { enabled: false }, false);
            grid?.updateColumn('imaginary-column', {
                header: {
                    format: 'New One!'
                }
            }, false);

            return grid?.options?.columns;
        }),
        'Varations of updateColumn method should work correctly.'
    ).toStrictEqual(
        [{
            id: 'product',
            header: {
                format: 'Column 1'
            },
            cells: {
                format: 'after update'
            },
            enabled: false
        }, {
            id: 'imaginary-column',
            header: {
                format: 'New One!'
            }
        }]
    );

    expect(
        await gridHandle.evaluate(grid => grid?.getOptionsJSON()),
        'The getOptionsJSON method should return the correct JSON string.'
    ).toBe(
        '{"columns":[{"id":"product","header":{"format":"Column 1"},"cells":{"format":"after update"},"enabled":false},' +
        '{"id":"imaginary-column","header":{"format":"New One!"}}],"dataTable":{"columns":{"product":["Apples","P' +
        'ears","Plums","Bananas"],"weight":[100,40,0.5,200],"price":[1.5,2.53,5,4.5]}}}'
    );
});
