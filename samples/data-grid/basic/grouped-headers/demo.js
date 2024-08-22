DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            id: ['1', '2', '3', '4'],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            url: ['http://path1.to', 'http://path2.to', 'http://path2.to', 'http://path3.to'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    settings: {
        header: [
            {
                columnId: 'id'
            },
            {
                headerFormat: '<h1><span>Product asdas</span></h1>',
                columns: [{
                    headerFormat: 'Product name',
                    columnId: 'product'
                }, {
                    headerFormat: 'Units',
                    columns: [{
                        columnId: 'weight'
                    }, {
                        headerFormat: 'Custom Price',
                        columnId: 'price'
                    }]
                }]
            },
            {
                headerFormat: 'Product info',
                columns: [{
                    headerFormat: 'Meta',
                    columns: [{
                        columnId: 'url'
                    }, {
                        columnId: 'icon'
                    }]
                }]
            }
        ]
    },
    defaults: {
        columns: {
            sorting: {
                enabled: true
            }
        }
    },
    columns: {
        product: {
            className: 'custom-column-product-class',
            headerFormat: '{id} name'
        },
        weight: {
            headerFormat: 'Custom weight'
        }
    }
});
