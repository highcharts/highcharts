import '/base/code/grid/es-modules/masters/grid-pro.src.js';
import SortToolbarButton from '/base/code/grid/es-modules/Grid/Core/Table/Header/ColumnToolbar/ToolbarButtons/SortToolbarButton.js';
import FilterToolbarButton from '/base/code/grid/es-modules/Grid/Core/Table/Header/ColumnToolbar/ToolbarButtons/FilterToolbarButton.js';

const Grid = window.Grid;
const { test } = QUnit;

const dataTableOptions = {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Cherries', 'Figs'],
            weight: [100, 40, 0.5, 200, 10, 20],
            price: [1.5, 2.53, 5, 4.5, 3.7, 2.1]
        }
    }
};

test('Grid partial update: columns[].sorting.order', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, dataTableOptions, true);
    const viewport = grid.viewport;

    const tableElementBefore = viewport.tableElement;
    const productColumn = viewport.getColumn('product');

    await grid.update({
        columns: [{
            id: 'product',
            sorting: {
                order: 'asc',
            }
        }]
    });

    assert.deepEqual(
        productColumn.data,
        ['Apples', 'Bananas', 'Cherries', 'Figs', 'Pears', 'Plums'],
        'The data should be sorted in ascending order.'
    );

    assert.ok(
        productColumn.header.toolbar.buttons.find(
            button => button instanceof SortToolbarButton
        )?.isActive, 
        'The sorting button should be active.'
    );

    assert.strictEqual(
        grid.tableElement,
        tableElementBefore,
        "Update shouldn't re-render the entire grid."
    );

    viewport.resizeObserver?.disconnect();
});

test('Grid partial update: columns[].filtering.condition and value', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, {
        ...dataTableOptions,
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

    assert.deepEqual(
        productColumn.data,
        ['Pears', 'Plums'],
        'The data should be filtered by the new condition and value.'
    );

    assert.ok(
        viewport.getColumn('product').header.toolbar.buttons.find(
          button => button instanceof FilterToolbarButton
        )?.isActive, 
        'The filtering button should be active.'
    );

    assert.strictEqual(
        grid.tableElement,
        tableElementBefore,
        "Update shouldn't re-render the entire grid."
    );

    viewport.resizeObserver?.disconnect();
});

test('Grid partial update: columns[].width', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, {
        ...dataTableOptions,
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

    assert.strictEqual(
        productColumn.getWidth(),
        300,
        'The width should be properly updated.'
    );

    assert.strictEqual(
        grid.tableElement,
        tableElementBefore,
        "Update shouldn't re-render the entire grid."
    );
    
    viewport.resizeObserver?.disconnect();
});

test('Grid partial update: pagination.page and pageSize', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, {
        ...dataTableOptions,
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

    assert.deepEqual(
        productColumn.data,
        ['Cherries', 'Figs'],
        'The data should be properly updated.'
    );

    assert.strictEqual(
        grid.pagination.pageNumbersContainer.querySelector('.hcg-button-selected')?.textContent,
        '3',
        'The active page button should be properly updated.'
    );

    assert.strictEqual(
        grid.tableElement,
        tableElementBefore,
        "Update shouldn't re-render the entire grid."
    );

    viewport.resizeObserver?.disconnect();
});

test('Grid full update: pagination.enabled', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, dataTableOptions, true);

    assert.notOk(
        'pagination' in grid,
        "The pagination instance shouldn't initially exist."
    );

    await grid.update({
        pagination: {
            enabled: true
        }
    });

    assert.ok(
        grid.pagination,
        'The pagination instance should be created.'
    );

    await grid.update({
        pagination: {
            enabled: false
        }
    });

    assert.notOk(
        'pagination' in grid,
        'The pagination instance should be completely destroyed.'
    );

    grid.viewport.resizeObserver?.disconnect();
});
