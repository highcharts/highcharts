import { test, expect } from '../fixtures.ts';

declare const Grid: any;

// Equivalent of test/typescript-karma/Grid/grid.test.js - setOptions test
test('Grid setOptions function', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/datagrid/datagrid.src.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/dashboards/css/datagrid.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    // Test that default options are initially defined
    const defaultCreditsEnabled = await page.evaluate(() => {
        return (window as any).Grid.defaultOptions.credits.enabled;
    });
    expect(defaultCreditsEnabled, 'The default options should be initially defined.').toBe(true);

    // Test that setOptions modifies the default options
    const modifiedCreditsEnabled = await page.evaluate(() => {
        (window as any).Grid.setOptions({
            credits: {
                enabled: false
            }
        });
        return (window as any).Grid.defaultOptions.credits.enabled;
    });
    expect(modifiedCreditsEnabled, 'The setOptions function should modify the default options.').toBe(false);
});

// Equivalent of test/typescript-karma/Grid/grid.test.js - update methods test
test('Grid update methods', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/datagrid/datagrid.src.js"></script>
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
        await gridHandle.evaluate(grid => {
            const options = grid?.getOptions();
            return options ? JSON.stringify(options) : '';
        }),
        'The getOptions method should return the correct JSON string.'
    ).toBe(
        '{"columns":[{"id":"product","header":{"format":"Column 1"},"cells":{"format":"after update"},"enabled":false},' +
        '{"id":"imaginary-column","header":{"format":"New One!"}}],"dataTable":{"columns":{"product":["Apples","P' +
        'ears","Plums","Bananas"],"weight":[100,40,0.5,200],"price":[1.5,2.53,5,4.5]}}}'
    );
});

// Equivalent of test/typescript-karma/Grid/columnOptions.test.js - formatter options test
test('Grid formatter options', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/datagrid/datagrid.src.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/dashboards/css/datagrid.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const gridCreated = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return false;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                    weight: [100, 40, 0.5, 200],
                    price: [1.5, 2.53, 5, 4.5]
                }
            },
            columnDefaults: {
                header: {
                    formatter: function () {
                        return 1; // Should not throw an error even if wrong type
                    }
                },
                cells: {
                    formatter: function () {
                        return 2; // Should not throw an error even if wrong type
                    }
                }
            }
        }, true);
        grid.viewport?.resizeObserver?.disconnect();

        return !!grid;
    });

    expect(gridCreated, 'Formatter returns the wrong type, but it can be stringified without causing an error.').toBe(true);
});

// Equivalent of test/typescript-karma/Grid/credits.test.js - credits test
test('Grid credits', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/datagrid/datagrid.src.js"></script>
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
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                    weight: [100, 40, 0.5, 200],
                    price: [1.5, 2.53, 5, 4.5]
                }
            }
        }, true);
        grid.viewport?.resizeObserver?.disconnect();

        return grid;
    });

    // Credits should be initialized
    expect(
        await gridHandle.evaluate((grid: any) => !!grid?.credits),
        'Credits should be initialized.'
    ).toBe(true);

    // Update credits
    await gridHandle.evaluate((grid: any) => {
        grid?.credits?.update({
            text: 'Grid credits',
            href: 'https://placeholder.web',
            position: 'top'
        });
    });

    // Check credits text is updated
    expect(
        await gridHandle.evaluate(
            (grid: any) => grid?.credits?.textElement?.textContent
        ),
        'Credits text should be updated.'
    ).toBe('Grid credits');

    // Check credits href is updated
    expect(
        await gridHandle.evaluate(
            (grid: any) => grid?.credits?.textElement?.getAttribute('href')
        ),
        'Credits href should be updated.'
    ).toBe('https://placeholder.web');

    // Check credits position
    expect(
        await gridHandle.evaluate((grid: any) => 
            grid?.contentWrapper?.firstChild === grid?.credits?.containerElement
        ),
        'Credits should be positioned at the top if specified so.'
    ).toBe(true);

    // Disable credits
    await gridHandle.evaluate((grid: any) => {
        grid?.credits?.update({
            enabled: false
        });
    });

    expect(
        await gridHandle.evaluate((grid: any) => !!grid?.credits),
        'Credits should be able to be disabled.'
    ).toBe(false);

    // Re-enable credits via grid.update
    await gridHandle.evaluate(async (grid: any) => {
        await grid?.update({
            credits: {
                enabled: true
            }
        });
        grid?.viewport?.resizeObserver?.disconnect();
    });

    expect(
        await gridHandle.evaluate((grid: any) => !!grid?.credits),
        'Credits should be able to be enabled.'
    ).toBe(true);
});

// Equivalent of test/typescript-karma/Grid/grid.test.js - custom sorting test
test('Grid custom sorting', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/datagrid/datagrid.src.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/dashboards/css/datagrid.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const sortedLabelData = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    label: ['A', 'B', 'C', 'D'],
                    weight: ['100 g', '40 kg', '0.5 kg', '800 g']
                }
            },
            columns: [{
                id: 'weight',
                sorting: {
                    compare: (a: string, b: string) => {
                        const convert = (n: string) => parseFloat(n) * (
                            n.endsWith('kg') ? 1000 : 1
                        );
                        return convert(b) - convert(a);
                    }
                }
            }]
        }, true);
        grid.viewport?.resizeObserver?.disconnect();

        await grid.viewport?.getColumn('weight')?.sorting?.setOrder('asc');

        return grid.viewport?.getColumn('label')?.data;
    });

    expect(
        sortedLabelData,
        'Column "label" should be sorted according to the "weight" column in ascending order.'
    ).toStrictEqual(['B', 'D', 'C', 'A']);
});
