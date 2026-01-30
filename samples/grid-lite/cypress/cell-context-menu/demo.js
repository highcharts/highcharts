(function () {
    const doc = document;

    Grid.grid('container', {
        dataTable: {
            columns: {
                product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                weight: [100, 40, 0.5, 200]
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
