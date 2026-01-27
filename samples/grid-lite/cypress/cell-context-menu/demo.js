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
                        onClick: function () {
                            doc.getElementById('cellContextMenuResult').value =
                                this.row.index + '|' +
                                this.column.id + '|' +
                                this.cell.value;
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
