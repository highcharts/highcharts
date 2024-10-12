DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            id: ['1', '2', '3', '4'],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    accessiblity: {
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
        sorting: {
            sortable: true
        }
    },
    header: [
        'id',
        {
            format: 'Product',
            accessibility: {
                description: 'The product group consists in two columns: ' +
                    'product name and units'
            },
            columns: [{
                format: 'Product name',
                columnId: 'product'
            }, {
                format: 'Units',
                accessibility: {
                    description: 'The Units group consists in two columns: ' +
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
        cells: {
            accessibility: {
                beforeEdit: 'The weight value can be edited',
                afterEdit: 'The weight value has been updated',
                cancelEdit: 'The editing of weight value has been cancelled'
            }
        },
        header: {
            format: 'Weight',
            accessibility: {
                description: 'The weight column (in kilograms)'
            }
        }
    }]
});
