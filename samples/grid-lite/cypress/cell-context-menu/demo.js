(function () {
    const doc = document;
    const rows = 200;
    const products = [];
    const weights = [];

    for (let i = 0; i < rows; i++) {
        products.push('Product ' + (i + 1));
        weights.push(i + 1);
    }

    Grid.grid('container', {
        dataTable: {
            columns: {
                product: products,
                weight: weights
            }
        },
        columnDefaults: {
            cells: {
                contextMenu: {
                    items: [{
                        label: 'Show context',
                        icon: 'menu',
                        // `ctx` is the cell context.
                        onClick: function (ctx) {
                            doc.getElementById('cellContextMenuResult').value =
                                ctx.row.index + '|' +
                                ctx.column.id + '|' +
                                ctx.cell.value;
                        }
                    }]
                }
            }
        },
        columns: [{
            id: 'weight',
            // Keep native menu on weight cells
            cells: {
                contextMenu: {
                    items: []
                }
            }
        }]
    });
}());
