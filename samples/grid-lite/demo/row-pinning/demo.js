const topPinned = document.getElementById('topPinned');
const bottomPinned = document.getElementById('bottomPinned');

const rowCount = 80;
const rows = Array.from({ length: rowCount }, (_, i) => {
    const id = 'SKU-' + String(i + 1).padStart(3, '0');

    return {
        id,
        product: 'Product ' + (i + 1),
        category: ['Fruit', 'Vegetable', 'Snacks', 'Drinks'][i % 4],
        stock: 15 + ((i * 7) % 90),
        price: Number((1 + (i % 12) * 0.35).toFixed(2))
    };
});

function updatePinnedSummary(grid) {
    const pinned = grid.getPinnedRows();

    if (topPinned) {
        topPinned.textContent = pinned.topIds.length ?
            pinned.topIds.join(', ') :
            'None';
    }

    if (bottomPinned) {
        bottomPinned.textContent = pinned.bottomIds.length ?
            pinned.bottomIds.join(', ') :
            'None';
    }
}

function getRowId(cell) {
    return cell.row.id;
}

function pinToTop(cell) {
    const grid = cell.row.viewport.grid;
    const rowId = getRowId(cell);

    void grid.pinRow(rowId, 'top').then(() => {
        updatePinnedSummary(grid);
    });
}

function pinToBottom(cell) {
    const grid = cell.row.viewport.grid;
    const rowId = getRowId(cell);

    void grid.pinRow(rowId, 'bottom').then(() => {
        updatePinnedSummary(grid);
    });
}

function unpinRow(cell) {
    const grid = cell.row.viewport.grid;
    const rowId = getRowId(cell);

    void grid.unpinRow(rowId).then(() => {
        updatePinnedSummary(grid);
    });
}

const rowContextMenu = {
    items: [{
        label: 'Pin row to top',
        icon: 'addRowAbove',
        onClick: pinToTop
    }, {
        label: 'Pin row to bottom',
        icon: 'addRowBelow',
        onClick: pinToBottom
    }, {
        separator: true
    }, {
        label: 'Unpin row',
        icon: 'trash',
        onClick: unpinRow
    }]
};

const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            id: rows.map(row => row.id),
            product: rows.map(row => row.product),
            category: rows.map(row => row.category),
            stock: rows.map(row => row.stock),
            price: rows.map(row => row.price)
        }
    },
    rendering: {
        rows: {
            pinning: {
                topIds: [0],
                bottomIds: [rowCount - 1]
            }
        }
    },
    columnDefaults: {
        cells: {
            contextMenu: rowContextMenu
        }
    },
    columns: [{
        id: 'id',
        header: {
            format: 'Row ID'
        },
        width: 140
    }, {
        id: 'product',
        width: 220
    }, {
        id: 'category',
        width: 160
    }, {
        id: 'stock',
        header: {
            format: 'Stock'
        }
    }, {
        id: 'price',
        cells: {
            format: '${value}'
        }
    }]
});

updatePinnedSummary(grid);
