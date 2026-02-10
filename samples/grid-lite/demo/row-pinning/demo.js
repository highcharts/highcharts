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
        topPinned.textContent = pinned.top.length ?
            pinned.top.join(', ') :
            'None';
    }

    if (bottomPinned) {
        bottomPinned.textContent = pinned.bottom.length ?
            pinned.bottom.join(', ') :
            'None';
    }
}

function getRowId(cell) {
    return cell.row.data.id;
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
            rowIdColumn: 'id',
            virtualizationThreshold: 30,
            pinned: {
                top: ['SKU-001'],
                bottom: ['SKU-080']
            }
        }
    },
    columnDefaults: {
        cells: {
            contextMenu: {
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
            }
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

(window).grid = grid;
updatePinnedSummary(grid);

function applyThreeRowPinnedHeightLimit(attemptsLeft) {
    const firstDataRow = document.querySelector(
        '#container tbody.hcg-tbody-scrollable tr'
    );
    const rowHeight = firstDataRow?.getBoundingClientRect().height || 0;
    if (!rowHeight) {
        if ((attemptsLeft || 0) > 0) {
            requestAnimationFrame(function () {
                applyThreeRowPinnedHeightLimit((attemptsLeft || 0) - 1);
            });
        }
        return;
    }

    const maxHeight = Math.round(rowHeight * 3);
    void grid.update({
        rendering: {
            rows: {
                pinned: {
                    maxTopHeight: maxHeight,
                    maxBottomHeight: maxHeight
                }
            }
        }
    });
}

applyThreeRowPinnedHeightLimit(30);
