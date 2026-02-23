const logList = document.getElementById('eventLog');
const clearBtn = document.getElementById('clearLog');

function logEvent(message) {
    if (!logList) {
        return;
    }

    const time = new Date().toLocaleTimeString();
    const li = document.createElement('li');
    li.textContent = '[' + time + '] ' + message;

    logList.insertBefore(li, logList.firstChild);

    // Keep the list small so it doesn't grow forever.
    while (logList.children.length > 25) {
        logList.removeChild(logList.lastChild);
    }
}

if (clearBtn && logList) {
    clearBtn.addEventListener('click', function () {
        logList.innerHTML = '';
        logEvent('Event log cleared.');
    });
}

function copyToClipboard(text) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        return Promise.reject(new Error('Clipboard API unavailable.'));
    }

    return navigator.clipboard.writeText(text);
}

let newColumnCount = 1;
let columnOrder = [];

function getNextColumnId(existingIds) {
    let id = '';

    do {
        id = 'new column ' + newColumnCount;
        newColumnCount += 1;
    } while (existingIds.indexOf(id) !== -1);

    return id;
}

async function getSourceRowIndex(cell) {
    const grid = cell.row.viewport.grid;
    const rowId = cell.row.id;

    if (rowId !== void 0 && grid.dataProvider?.getScopedRowIndex) {
        const resolvedIndex = await grid.dataProvider.getScopedRowIndex(
            rowId,
            'raw'
        );

        if (typeof resolvedIndex === 'number') {
            return resolvedIndex;
        }
    }

    if (typeof rowId === 'number') {
        return rowId;
    }

    if (typeof cell.row.index === 'number') {
        return cell.row.index;
    }
}

async function addRowBelow(cell) {
    const grid = cell.row.viewport.grid;
    const dt = grid.dataTable;

    if (!dt) {
        return;
    }

    const insertAt = await getSourceRowIndex(cell);
    if (typeof insertAt !== 'number') {
        return;
    }

    const insertAtIndex = insertAt + 1;

    logEvent(
        'Added new row below position ' + insertAt + '.'
    );

    dt.setRow({
        product: 'New item',
        weight: null,
        price: null
    }, insertAtIndex, true);

    // Re-apply modifiers (if any) and update rendering.
    void grid.viewport.updateRows();
}

async function addRowAbove(cell) {
    const grid = cell.row.viewport.grid;
    const dt = grid.dataTable;

    if (!dt) {
        return;
    }

    const insertAt = await getSourceRowIndex(cell);
    if (typeof insertAt !== 'number') {
        return;
    }

    logEvent(
        'Added new row above position ' + insertAt + '.'
    );

    dt.setRow({
        product: 'New item',
        weight: null,
        price: null
    }, insertAt, true);

    // Re-apply modifiers (if any) and update rendering.
    void grid.viewport.updateRows();
}

function addColumnLeft(cell) {
    const grid = cell.row.viewport.grid;
    const dt = grid.dataTable;

    if (!dt) {
        return;
    }

    if (!columnOrder.length) {
        columnOrder = dt.getColumnIds();
    }

    const columnIds = columnOrder.slice();
    const currentIndex = columnIds.indexOf(cell.column.id);
    const insertIndex = currentIndex < 0 ? columnIds.length : currentIndex;
    const newColumnId = getNextColumnId(columnIds);
    dt.setColumn(newColumnId, []);

    columnIds.splice(insertIndex, 0, newColumnId);
    columnOrder = columnIds;

    logEvent('Added column "' + newColumnId + '" to the left.');

    void grid.update({
        rendering: {
            columns: {
                included: columnIds
            }
        }
    });
}

function addColumnRight(cell) {
    const grid = cell.row.viewport.grid;
    const dt = grid.dataTable;

    if (!dt) {
        return;
    }

    if (!columnOrder.length) {
        columnOrder = dt.getColumnIds();
    }

    const columnIds = columnOrder.slice();
    const currentIndex = columnIds.indexOf(cell.column.id);
    const insertIndex = currentIndex < 0 ?
        columnIds.length :
        currentIndex + 1;
    const newColumnId = getNextColumnId(columnIds);
    dt.setColumn(newColumnId, []);

    columnIds.splice(insertIndex, 0, newColumnId);
    columnOrder = columnIds;

    logEvent('Added column "' + newColumnId + '" to the right.');

    void grid.update({
        rendering: {
            columns: {
                included: columnIds
            }
        }
    });
}

async function deleteRow(cell) {
    const grid = cell.row.viewport.grid;
    const dt = grid.dataTable;

    if (!dt) {
        return;
    }

    const deleteAt = await getSourceRowIndex(cell);
    if (typeof deleteAt !== 'number') {
        return;
    }

    logEvent(
        'Deleted row at position ' + deleteAt + '.'
    );

    dt.deleteRows(deleteAt, 1);

    // Re-apply modifiers (if any) and update rendering.
    void grid.viewport.updateRows();
}

const menuItems = [{
    label: 'Copy cell content',
    icon: 'clipboard',
    onClick: function (cell) {
        const value = String(cell.value);

        copyToClipboard(value)
            .then(function () {
                logEvent('Copied "' + value + '" to clipboard!');
            })
            .catch(function () {
                logEvent('Could not copy "' + value + '" to clipboard.');
            });
    }
}, {
    separator: true
}, {
    label: 'Pinning',
    icon: 'pin01',
    items: [
        'pinRowTop',
        'pinRowBottom',
        {
            actionId: 'unpinRow',
            icon: 'pin02'
        }
    ]
}, {
    label: 'Edit',
    items: [{
        label: 'Rows',
        items: [{
            label: 'Add row above',
            icon: 'addRowAbove',
            onClick: addRowAbove
        }, {
            label: 'Add row below',
            icon: 'addRowBelow',
            onClick: addRowBelow
        }, {
            label: 'Delete row',
            icon: 'trash',
            onClick: deleteRow
        }]
    }, {
        label: 'Columns',
        items: [{
            label: 'Add column left',
            icon: 'addColumnLeft',
            onClick: addColumnLeft
        }, {
            label: 'Add column right',
            icon: 'addColumnRight',
            onClick: addColumnRight
        }]
    }]
}];

Grid.grid('container', {
    dataTable: {
        columns: {
            product: [
                'Apples',
                'Pears',
                'Plums',
                'Bananas',
                'Oranges'
            ],
            weight: [100, 40, 0.5, 200, 120],
            price: [1.5, 2.53, 5, 4.5, 3.2]
        }
    },
    columnDefaults: {
        cells: {
            contextMenu: {
                items: menuItems
            }
        }
    }
});

logEvent(
    'Ready. Right-click a cell to open the menu with pinning and nested items.'
);
