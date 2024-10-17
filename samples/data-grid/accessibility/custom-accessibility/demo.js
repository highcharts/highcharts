DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            id: ['1', '2', '3', '4'],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    accessibility: {
        enabled: true,
        cellEditing: {
            description: 'The cell can be edited',
            startEdit: 'Started editing the cell',
            afterEdit: 'The cell has been updated',
            cancelEdit: 'Cell\'s editing is cancelled'
        },
        sorting: {
            description: 'The column can be sorted',
            ascending: 'The column is sorted in ascending order',
            descending: 'The column is sorted in descending order',
            none: 'Cleared sorting of the column'
        }
    },
    columnDefaults: {
        cells: {
            editable: true
        }
    },
    header: [
        'id',
        {
            format: 'Product',
            accessibility: {
                description: 'The Product group consists of two columns: ' +
                    'product name and units'
            },
            columns: [{
                format: 'Product name',
                columnId: 'product'
            }, {
                format: 'Units',
                accessibility: {
                    description: 'The Units group consists of two columns: ' +
                        'weight and custom price'
                },
                columns: [{
                    columnId: 'weight'
                }, {
                    format: 'Custom price',
                    columnId: 'price'
                }]
            }]
        }
    ],
    columns: [{
        id: 'weight',
        header: {
            format: 'Weight'
        }
    }]
});
