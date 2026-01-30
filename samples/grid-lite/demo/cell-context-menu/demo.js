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

const menuItems = [{
    label: 'Copy cell content',
    icon: 'clipboard',
    // `ctx` is the cell context
    onClick: function (ctx) {
        const value = String(ctx.cell.value);

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
    label: 'Add row below',
    icon: 'plus',
    onClick: function (ctx) {
        const grid = ctx.cell.row.viewport.grid;
        const dt = grid.dataTable;

        if (!dt) {
            return;
        }

        const insertAt = ctx.row.id;
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
}, {
    label: 'Delete row',
    icon: 'trash',
    onClick: function (ctx) {
        const grid = ctx.cell.row.viewport.grid;
        const dt = grid.dataTable;

        if (!dt) {
            return;
        }

        const deleteAt = ctx.row.id;
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

logEvent('Ready. Right-click a cell to open the menu.');
