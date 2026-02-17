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

function getRowId(cell) {
    return cell.row.data.id;
}

function pinTop(cell) {
    const grid = cell.row.viewport.grid;
    void grid.pinRow(getRowId(cell), 'top')
        .then(() => updatePinnedInputs(grid));
}

function pinBottom(cell) {
    const grid = cell.row.viewport.grid;
    void grid.pinRow(getRowId(cell), 'bottom')
        .then(() => updatePinnedInputs(grid));
}

function unpin(cell) {
    const grid = cell.row.viewport.grid;
    void grid.unpinRow(getRowId(cell)).then(() => updatePinnedInputs(grid));
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
                items: [{
                    label: 'Pin row to top',
                    onClick: pinTop
                }, {
                    label: 'Pin row to bottom',
                    onClick: pinBottom
                }, {
                    label: 'Unpin row',
                    onClick: unpin
                }]
            }
        }
    }
});

(window).grid = grid;
updatePinnedInputs(grid);
