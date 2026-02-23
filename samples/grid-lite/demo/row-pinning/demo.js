const topPinned = document.getElementById('topPinned');
const bottomPinned = document.getElementById('bottomPinned');

const rowCount = 80;
const pinnedRowsVisibleCount = 4;
const estimatedRowHeight = 41;
const pinnedSectionMaxHeight = pinnedRowsVisibleCount * estimatedRowHeight;
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

const rowContextMenu = {
    items: ['pinRowTop', 'pinRowBottom', 'unpinRow']
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
                bottomIds: [rowCount - 1],
                top: {
                    maxHeight: pinnedSectionMaxHeight
                },
                bottom: {
                    maxHeight: pinnedSectionMaxHeight
                }
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

const pinRow = grid.pinRow.bind(grid);
const toggleRow = grid.toggleRow.bind(grid);
const unpinRow = grid.unpinRow.bind(grid);

grid.pinRow = function (...args) {
    return pinRow(...args).then(() => {
        updatePinnedSummary(grid);
    });
};

grid.toggleRow = function (...args) {
    return toggleRow(...args).then(() => {
        updatePinnedSummary(grid);
    });
};

grid.unpinRow = function (...args) {
    return unpinRow(...args).then(() => {
        updatePinnedSummary(grid);
    });
};

updatePinnedSummary(grid);
