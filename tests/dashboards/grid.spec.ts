import { test, expect } from '~/fixtures.ts';

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

// Equivalent of test/typescript-karma/Grid/update.test.js - partial update: columns[].sorting.order
test('Grid partial update: columns[].sorting.order', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs'],
                    weight: [100, 40, 0.5, 200, 10, 20],
                    price: [1.5, 2.53, 5, 4.5, 3.7, 2.1]
                }
            }
        }, true);

        const viewport = grid.viewport;
        const tableElementBefore = viewport.tableElement;
        const productColumn = viewport.getColumn('product');

        await grid.update({
            columns: [{
                id: 'product',
                sorting: {
                    order: 'asc'
                }
            }]
        });

        // Find the sort button by its aria-label instead of using instanceof
        const sortButtonActive = productColumn.header.toolbar.buttons.find(
            (button: any) => button.options?.accessibility?.ariaLabel === 'sort'
        )?.isActive;

        viewport.resizeObserver?.disconnect();

        return {
            sortedData: productColumn.data,
            sortButtonActive,
            tableElementUnchanged: grid.tableElement === tableElementBefore
        };
    });

    expect(result?.sortedData, 'The data should be sorted in ascending order.')
        .toStrictEqual(['Apples', 'Bananas', 'Cherries', 'Figs', 'Pears', 'Plums']);

    expect(result?.sortButtonActive, 'The sorting button should be active.')
        .toBe(true);

    expect(result?.tableElementUnchanged, 'Update shouldn\'t re-render the entire grid.')
        .toBe(true);
});

// Equivalent of test/typescript-karma/Grid/update.test.js - partial update: columns[].filtering.condition and value
test('Grid partial update: columns[].filtering.condition and value', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs'],
                    weight: [100, 40, 0.5, 200, 10, 20],
                    price: [1.5, 2.53, 5, 4.5, 3.7, 2.1]
                }
            },
            columns: [{
                id: 'product',
                // Make sure the filter icon is visible.
                width: 200,
                filtering: {
                    condition: 'contains',
                    value: 'Apple',
                    enabled: true
                }
            }]
        }, true);

        const viewport = grid.viewport;
        const tableElementBefore = viewport.tableElement;
        const productColumn = viewport.getColumn('product');

        await grid.update({
            columns: [{
                id: 'product',
                filtering: {
                    condition: 'beginsWith',
                    value: 'P'
                }
            }]
        });

        // Find the filter button by its aria-label instead of using instanceof
        const filterButtonActive = viewport.getColumn('product').header.toolbar.buttons.find(
            (button: any) => button.options?.accessibility?.ariaLabel === 'filter'
        )?.isActive;

        viewport.resizeObserver?.disconnect();

        return {
            filteredData: productColumn.data,
            filterButtonActive,
            tableElementUnchanged: grid.tableElement === tableElementBefore
        };
    });

    expect(result?.filteredData, 'The data should be filtered by the new condition and value.')
        .toStrictEqual(['Pears', 'Plums']);

    expect(result?.filterButtonActive, 'The filtering button should be active.')
        .toBe(true);

    expect(result?.tableElementUnchanged, 'Update shouldn\'t re-render the entire grid.')
        .toBe(true);
});

// Equivalent of test/typescript-karma/Grid/update.test.js - partial update: columns[].width
test('Grid partial update: columns[].width', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs'],
                    weight: [100, 40, 0.5, 200, 10, 20],
                    price: [1.5, 2.53, 5, 4.5, 3.7, 2.1]
                }
            },
            columns: [{
                id: 'product',
                width: 150
            }]
        }, true);

        const viewport = grid.viewport;
        const tableElementBefore = viewport.tableElement;
        const productColumn = viewport.getColumn('product');

        await grid.update({
            columns: [{
                id: 'product',
                width: 300
            }]
        });

        viewport.resizeObserver?.disconnect();

        return {
            updatedWidth: productColumn.getWidth(),
            tableElementUnchanged: grid.tableElement === tableElementBefore
        };
    });

    expect(result?.updatedWidth, 'The width should be properly updated.')
        .toBe(300);

    expect(result?.tableElementUnchanged, 'Update shouldn\'t re-render the entire grid.')
        .toBe(true);
});

// Equivalent of test/typescript-karma/Grid/update.test.js - partial update: pagination.page and pageSize
test('Grid partial update: pagination.page and pageSize', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs'],
                    weight: [100, 40, 0.5, 200, 10, 20],
                    price: [1.5, 2.53, 5, 4.5, 3.7, 2.1]
                }
            },
            pagination: {
                enabled: true,
                pageSize: 1,
                page: 2
            }
        }, true);

        const viewport = grid.viewport;
        const tableElementBefore = viewport.tableElement;
        const productColumn = viewport.getColumn('product');

        await grid.update({
            pagination: {
                pageSize: 2,
                page: 3
            }
        });

        const activePageButton = grid.pagination.pageNumbersContainer.querySelector('.hcg-button-selected')?.textContent;

        viewport.resizeObserver?.disconnect();

        return {
            paginatedData: productColumn.data,
            activePageButton,
            tableElementUnchanged: grid.tableElement === tableElementBefore
        };
    });

    expect(result?.paginatedData, 'The data should be properly updated.')
        .toStrictEqual(['Cherries', 'Figs']);

    expect(result?.activePageButton, 'The active page button should be properly updated.')
        .toBe('3');

    expect(result?.tableElementUnchanged, 'Update shouldn\'t re-render the entire grid.')
        .toBe(true);
});

// Equivalent of test/typescript-karma/Grid/update.test.js - full update: pagination.enabled
test('Grid full update: pagination.enabled', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    // Initial state - no pagination
    const initialState = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs'],
                    weight: [100, 40, 0.5, 200, 10, 20],
                    price: [1.5, 2.53, 5, 4.5, 3.7, 2.1]
                }
            }
        }, true);

        (window as any).testGrid = grid;

        return {
            hasPagination: 'pagination' in grid
        };
    });

    expect(initialState?.hasPagination, 'The pagination instance shouldn\'t initially exist.')
        .toBe(false);

    // Enable pagination
    const enabledState = await page.evaluate(async () => {
        const grid = (window as any).testGrid;
        const parentElement = document.getElementById('container');

        await grid.update({
            pagination: {
                enabled: true
            }
        });

        return {
            hasPagination: !!grid.pagination,
            hasPaginationWrapper: !!parentElement?.querySelector('.hcg-pagination-wrapper')
        };
    });

    expect(enabledState?.hasPagination, 'The pagination instance should be created.')
        .toBe(true);

    expect(enabledState?.hasPaginationWrapper, 'The pagination element should be in the DOM.')
        .toBe(true);

    // Disable pagination
    const disabledState = await page.evaluate(async () => {
        const grid = (window as any).testGrid;
        const parentElement = document.getElementById('container');

        await grid.update({
            pagination: {
                enabled: false
            }
        });

        grid.viewport.resizeObserver?.disconnect();

        return {
            hasPagination: 'pagination' in grid,
            hasPaginationWrapper: !!parentElement?.querySelector('.hcg-pagination-wrapper')
        };
    });

    expect(disabledState?.hasPagination, 'The pagination instance should be completely destroyed.')
        .toBe(false);

    expect(disabledState?.hasPaginationWrapper, 'The pagination element shouldn\'t be in the DOM.')
        .toBe(false);
});
