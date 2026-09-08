import { test, expect } from '~/fixtures.ts';

// Equivalent of test/typescript-karma/Grid/update.test.js - partial update: columns[].sorting.order
test('Grid partial update: columns[].sorting.order', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
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
            data: {
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

// Equivalent of test/typescript-karma/Grid/update.test.js - partial update: columns[].filtering.rule
test('Grid partial update: columns[].filtering.rule', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
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
            data: {
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
                    enabled: true,
                    rule: {
                        operator: 'contains',
                        value: 'Apple'
                    }
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
                    rule: {
                        operator: 'beginsWith',
                        value: 'P'
                    }
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

    expect(result?.filteredData, 'The data should be filtered by the new rule operator and value.')
        .toStrictEqual(['Pears', 'Plums']);

    expect(result?.filterButtonActive, 'The filtering button should be active.')
        .toBe(true);

    expect(result?.tableElementUnchanged, 'Update shouldn\'t re-render the entire grid.')
        .toBe(true);
});

// Equivalent of test/typescript-karma/Grid/update.test.js - partial update: columns[].width
test('Grid partial update: columns[].width', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
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
            data: {
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
        <!DOCTYPE html>
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
            data: {
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

test('Grid partial update: events should only swap callbacks, not re-render', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
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
            data: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs'],
                    weight: [100, 40, 0.5, 200, 10, 20],
                    price: [1.5, 2.53, 5, 4.5, 3.7, 2.1]
                }
            }
        }, true);

        const viewport = grid.viewport;
        const tableElementBefore = viewport.tableElement;

        let firstCallbackCalls = 0;
        let secondCallbackCalls = 0;

        // Register the first callback.
        await grid.update({
            events: {
                afterUpdate: () => {
                    firstCallbackCalls++;
                }
            }
        });

        // Replace it with a second callback. The first one must not fire again.
        await grid.update({
            events: {
                afterUpdate: () => {
                    secondCallbackCalls++;
                }
            }
        });

        viewport.resizeObserver?.disconnect();

        return {
            firstCallbackCalls,
            secondCallbackCalls,
            tableElementUnchanged: grid.tableElement === tableElementBefore
        };
    });

    // The first callback fired once (for its own update) and the second
    // callback replaced it and fired for the second update.
    expect(result?.firstCallbackCalls, 'The first callback should fire once, then be replaced.')
        .toBe(1);

    expect(result?.secondCallbackCalls, 'The new callback should be live.')
        .toBe(1);

    expect(result?.tableElementUnchanged, 'Updating events shouldn\'t re-render the entire grid.')
        .toBe(true);
});

test('Grid partial update: nested events should not re-render the grid', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
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
            data: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs'],
                    weight: [100, 40, 0.5, 200, 10, 20],
                    price: [1.5, 2.53, 5, 4.5, 3.7, 2.1]
                }
            },
            pagination: {
                enabled: true,
                pageSize: 2,
                page: 1
            },
            columns: [{
                id: 'product',
                width: 200
            }]
        }, true);

        const viewport = grid.viewport;
        const tableElementBefore = viewport.tableElement;

        // Update only nested event groups at every level.
        await grid.update({
            columnDefaults: {
                events: {
                    afterResize: () => {}
                }
            },
            columns: [{
                id: 'product',
                events: {
                    afterSort: () => {}
                },
                cells: {
                    events: {
                        click: () => {}
                    }
                },
                header: {
                    events: {
                        click: () => {}
                    }
                }
            }],
            pagination: {
                events: {
                    afterPageChange: () => {}
                }
            }
        });

        const productColumn = viewport.getColumn('product');

        viewport.resizeObserver?.disconnect();

        return {
            tableElementUnchanged: grid.tableElement === tableElementBefore,
            columnEventStored:
                typeof productColumn.options?.events?.afterSort === 'function',
            cellsEventStored:
                typeof productColumn.options?.cells?.events?.click === 'function',
            headerEventStored:
                typeof productColumn.options?.header?.events?.click === 'function',
            columnDefaultsEventStored:
                typeof grid.options?.columnDefaults?.events?.afterResize === 'function',
            paginationEventStored:
                typeof grid.options?.pagination?.events?.afterPageChange === 'function'
        };
    });

    expect(result?.tableElementUnchanged, 'Updating nested events shouldn\'t re-render the grid.')
        .toBe(true);

    expect(result?.columnEventStored, 'The column event callback should be stored live.')
        .toBe(true);

    expect(result?.cellsEventStored, 'The cells event callback should be stored live.')
        .toBe(true);

    expect(result?.headerEventStored, 'The header event callback should be stored live.')
        .toBe(true);

    expect(result?.columnDefaultsEventStored, 'The columnDefaults event callback should be stored live.')
        .toBe(true);

    expect(result?.paginationEventStored, 'The pagination event callback should be stored live.')
        .toBe(true);
});

// Equivalent of test/typescript-karma/Grid/update.test.js - full update: pagination.enabled
test('Grid full update: pagination.enabled', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
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
            data: {
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
            hasPaginationWrapper: !!parentElement?.querySelector('.hcg-pagination')
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
            hasPaginationWrapper: !!parentElement?.querySelector('.hcg-pagination')
        };
    });

    expect(disabledState?.hasPagination, 'The pagination instance should be completely destroyed.')
        .toBe(false);

    expect(disabledState?.hasPaginationWrapper, 'The pagination element shouldn\'t be in the DOM.')
        .toBe(false);
});

