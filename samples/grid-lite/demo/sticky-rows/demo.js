const rows = Array.from({ length: 120 }, (_, i) => {
    const n = i + 1;

    return {
        id: 'SKU-' + String(n).padStart(3, '0'),
        product: 'Product ' + n,
        category: ['Fruit', 'Vegetable', 'Drinks', 'Snacks'][n % 4],
        stock: (n * 7) % 100,
        price: '$' + (n * 0.35 + 1).toFixed(2)
    };
});

const columns = {
    id: rows.map(row => row.id),
    product: rows.map(row => row.product),
    category: rows.map(row => row.category),
    stock: rows.map(row => row.stock),
    price: rows.map(row => row.price)
};

function resolveRowId(cell) {
    return String(cell.row.data.id || '');
}

const stickyMenuItems = [{
    label: 'Stick row',
    icon: 'plus',
    onClick: function (cell) {
        const cellGrid = cell.row.viewport.grid;
        const rowId = resolveRowId(cell);

        if (!rowId || !cellGrid.stickRow) {
            return;
        }

        void cellGrid.stickRow(rowId);
    }
}, {
    label: 'Unstick row',
    icon: 'trash',
    onClick: function (cell) {
        const cellGrid = cell.row.viewport.grid;
        const rowId = resolveRowId(cell);

        if (!rowId || !cellGrid.unstickRow) {
            return;
        }

        void cellGrid.unstickRow(rowId);
    }
}];

Grid.grid('container', {
    dataTable: {
        columns
    },
    rendering: {
        rows: {
            virtualizationThreshold: 30,
            sticky: {
                idColumn: 'id',
                ids: ['SKU-003', 'SKU-040']
            }
        }
    },
    columns: [{
        id: 'id',
        cells: {
            contextMenu: {
                items: stickyMenuItems
            }
        }
    }, {
        id: 'product',
        cells: {
            contextMenu: {
                items: stickyMenuItems
            }
        }
    }, {
        id: 'category',
        cells: {
            contextMenu: {
                items: stickyMenuItems
            }
        }
    }, {
        id: 'stock',
        sorting: {
            order: 'desc'
        },
        cells: {
            contextMenu: {
                items: stickyMenuItems
            }
        }
    }, {
        id: 'price',
        cells: {
            contextMenu: {
                items: stickyMenuItems
            }
        }
    }]
});
