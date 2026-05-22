class CustomColumnResizingMode extends Grid.ColumnResizing.types.independent {
    constructor(viewport) {
        super(viewport);
        this.type = 'custom';
    }

    resize(resizer, diff) {
        const column = resizer.draggedColumn;
        if (!column) {
            return;
        }

        const toPercent = val => column.viewport.getRatioFromWidth(val) * 100;

        this.columnWidths[column.id] = toPercent(Math.max(
            (resizer.columnStartWidth || 0) + diff,
            CustomColumnResizingMode.getMinWidth(column)
        ));
        this.columnWidthUnits[column.id] = 1; // Always save in percent
    }
}

Grid.ColumnResizing.types.custom = CustomColumnResizingMode;

Grid.grid('container', {
    data: {
        columns: {
            product: Array.from({ length: 40 }, (_, i) => `A${i}`),
            weight: Array.from({ length: 40 }, (_, i) => `B${i}`),
            price: Array.from({ length: 40 }, (_, i) => `C${i}`),
            icon: Array.from({ length: 40 }, (_, i) => `E${i}`),
            meta: Array.from({ length: 40 }, (_, i) => `F${i}`)
        }
    },
    rendering: {
        columns: {
            resizing: {
                mode: 'custom'
            }
        }
    },
    columns: [{
        id: 'product',
        header: {
            format: '20% width'
        },
        width: '20%'
    }, {
        id: 'weight',
        header: {
            format: '100px width'
        },
        width: '100px'
    }, {
        id: 'price',
        header: {
            format: 'Not defined width'
        }
    }, {
        id: 'icon',
        header: {
            format: '15% width'
        },
        width: '15%'
    }, {
        id: 'meta',
        header: {
            format: 'Not defined width'
        }
    }]
});
