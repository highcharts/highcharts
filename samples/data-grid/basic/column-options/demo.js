DataGrid.dataGrid('container', {
    table: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    defaults: {
        columns: {
            editable: true,
            sorting: true
        }
    },
    columns: {
        weight: {
            className: 'custom-column-class-name',
            cellFormatter: function () {
                return 'V: ' + this.value;
            }
        },
        metaData: {
            enabled: false
        }
    }
});