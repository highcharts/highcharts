//@ts-check
import Grid from '/base/code/grid/es-modules/masters/grid-pro.src.js';
import U from '/base/code/es-modules/Core/Utilities.js';

const { test } = QUnit;
const { addEvent } = U;

const waitForAfterSort = (grid) => new Promise((resolve) => {
    const unbind = addEvent(grid, 'afterSort', () => {
        unbind();
        resolve();
    });
});

test('Grid multi-column sorting via querying API', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, {
        dataTable: {
            columns: {
                x: [1, 2, 1, 2, 1],
                y: [5, 4, 3, 2, 1],
                id: ['a', 'b', 'c', 'd', 'e']
            }
        }
    }, true);
    grid.viewport?.resizeObserver?.disconnect();

    await grid.setSorting([
        { columnId: 'x', order: 'asc' },
        { columnId: 'y', order: 'asc' }
    ]);

    assert.deepEqual(
        grid.viewport?.getColumn('id')?.data,
        ['e', 'c', 'a', 'd', 'b'],
        'Grid should be sorted by x (asc) then y (asc)'
    );
});

test('Grid multi-column sorting with custom compare', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, {
        dataTable: {
            columns: {
                x: [1, 1, 1, 2, 2],
                y: [1, 2, 3, 4, 5],
                id: ['a', 'b', 'c', 'd', 'e']
            }
        },
        columns: [{
            id: 'y',
            sorting: {
                compare: (a, b) => (b || 0) - (a || 0)
            }
        }]
    }, true);
    grid.viewport?.resizeObserver?.disconnect();

    await grid.setSorting([
        { columnId: 'x', order: 'asc' },
        { columnId: 'y', order: 'asc' }
    ]);

    assert.deepEqual(
        grid.viewport?.getColumn('id')?.data,
        ['c', 'b', 'a', 'e', 'd'],
        'Custom compare is applied to secondary sort'
    );
});

test('Grid multi-column sorting via shift-click', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    parentElement.style.width = '800px';
    parentElement.style.height = '300px';

    const grid = await Grid.grid(parentElement, {
        dataTable: {
            columns: {
                x: [1, 2, 1, 2, 1],
                y: [3, 4, 5, 2, 1],
                id: ['c', 'b', 'a', 'd', 'e']
            }
        }
    }, true);
    grid.viewport?.resizeObserver?.disconnect();

    const xHeader = grid.viewport?.getColumn('x')?.header?.htmlElement;
    const yHeader = grid.viewport?.getColumn('y')?.header?.htmlElement;

    if (!xHeader || !yHeader) {
        assert.ok(false, 'Missing header elements');
        return;
    }

    let afterSortPromise = waitForAfterSort(grid);
    xHeader.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await afterSortPromise;

    assert.deepEqual(
        grid.viewport?.getColumn('id')?.data,
        ['c', 'a', 'e', 'b', 'd'],
        'Click sorts primary column'
    );

    afterSortPromise = waitForAfterSort(grid);
    yHeader.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
    await afterSortPromise;

    assert.deepEqual(
        grid.viewport?.getColumn('id')?.data,
        ['e', 'c', 'a', 'd', 'b'],
        'Shift-click adds a secondary sort'
    );

    const xPriority = xHeader.querySelector('.hcg-sort-priority-indicator');
    const yPriority = yHeader.querySelector('.hcg-sort-priority-indicator');

    assert.strictEqual(
        xPriority?.textContent,
        '1',
        'Primary sort shows priority 1'
    );
    assert.strictEqual(
        yPriority?.textContent,
        '2',
        'Secondary sort shows priority 2'
    );

    afterSortPromise = waitForAfterSort(grid);
    yHeader.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
    await afterSortPromise;

    assert.deepEqual(
        grid.viewport?.getColumn('id')?.data,
        ['a', 'c', 'e', 'b', 'd'],
        'Shift-click toggles secondary sort direction'
    );

    afterSortPromise = waitForAfterSort(grid);
    yHeader.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
    await afterSortPromise;

    assert.deepEqual(
        grid.viewport?.getColumn('id')?.data,
        ['c', 'a', 'e', 'b', 'd'],
        'Shift-click removes secondary sort'
    );

    assert.strictEqual(
        xHeader.querySelector('.hcg-sort-priority-indicator'),
        null,
        'Priority indicators are hidden when only one column is sorted'
    );
});
