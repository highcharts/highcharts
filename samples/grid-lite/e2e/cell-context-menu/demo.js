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
        data: {
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
                        onClick: function (cell) {
                            doc.getElementById('cellContextMenuResult').value =
                                cell.row.index + '|' +
                                cell.column.id + '|' +
                                cell.value;
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
