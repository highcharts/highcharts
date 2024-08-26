window.dataGrid = DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            id: ['1', '2', '3', '4'],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200, 100, 40, 0.5, 200, 100],
            price: [1.5, 2.53, 5, 4.5],
            url: ['http://path1.to', 'http://path2.to', 'http://path2.to', 'http://path3.to'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    settings: {
        header: [
            'id',
            {
                headerFormat: 'Product',
                columns: [{
                    headerFormat: 'Product name',
                    columnId: 'product'
                }, {
                    headerFormat: 'Units',
                    columns: [{
                        columnId: 'weight'
                    }]
                }]
            }, {
                headerFormat: 'Product info',
                columns: [{
                    headerFormat: 'Meta',
                    columns: [{
                        columnId: 'icon'
                    }]
                }]
            }
        ]
    },
    columns: {
        product: {
            headerFormat: '{id} test'
        },
        price: {
            enabled: true
        }
    }
});
