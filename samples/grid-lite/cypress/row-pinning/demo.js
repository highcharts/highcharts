const rowCount = 60;
const rows = Array.from({ length: rowCount }, (_, i) => {
    const id = 'ROW-' + String(i + 1).padStart(3, '0');

    return {
        id,
        product: 'Product ' + (i + 1),
        group: ['A', 'B', 'C'][i % 3],
        stock: 10 + (i % 40)
    };
});

const topInput = document.getElementById('pinnedTop');
const bottomInput = document.getElementById('pinnedBottom');

function updatePinnedInputs(grid) {
    const pinned = grid.getPinnedRows();

    if (topInput) {
        topInput.value = pinned.topIds.join(',');
    }

    if (bottomInput) {
        bottomInput.value = pinned.bottomIds.join(',');
    }
}

const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            id: rows.map(row => row.id),
            product: rows.map(row => row.product),
            group: rows.map(row => row.group),
            stock: rows.map(row => row.stock)
        }
    },
    rendering: {
        rows: {
            virtualizationThreshold: 20,
            pinning: {
                idColumn: 'id',
                topIds: ['ROW-001'],
                bottomIds: ['ROW-060']
            }
        }
    },
    columnDefaults: {
        cells: {
            contextMenu: {
                enabled: true
            }
        }
    }
});

const pinRow = grid.pinRow.bind(grid);
const toggleRow = grid.toggleRow.bind(grid);
const unpinRow = grid.unpinRow.bind(grid);

grid.pinRow = function (...args) {
    return pinRow(...args).then(() => {
        updatePinnedInputs(grid);
    });
};

grid.toggleRow = function (...args) {
    return toggleRow(...args).then(() => {
        updatePinnedInputs(grid);
    });
};

grid.unpinRow = function (...args) {
    return unpinRow(...args).then(() => {
        updatePinnedInputs(grid);
    });
};

(window).grid = grid;
updatePinnedInputs(grid);
