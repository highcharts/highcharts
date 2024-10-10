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
        description: 'The data table shows vegatables and prices'
    },
    columnDefaults: {
        cells: {
            accessibility: {
                beforeEdit: 'The cell can be edited',
                afterEdit: 'The cell has been updated',
                cancelEdit: 'Cell\'s editing is cancelled'
            }
        },
        sorting: {
            sortable: true
        }
    },
    header: [
        'id',
        {
            format: 'Product',
            accessibility: {
                descripion: `The product group consists in two columns:
                    product name and units`
            },
            columns: [{
                format: 'Product name',
                columnId: 'product'
            }, {
                format: 'Units',
                accessibility: {
                    descripion: `The Units group consists in two columns:
                        weight and custom price`
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
