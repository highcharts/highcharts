Grid.grid('container', {
    dataTable: {
        columns: {
            id: ['1', '2', '3', '4'],
            product: ['Apples', 'Pears', 'Plums', 'Apricots'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            url: ['http://path1.to', 'http://path2.to', 'http://path2.to', 'http://path3.to'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    header: [
        'id',
        {
            format: 'Product',
            columns: [{
                format: 'Product name',
                columnId: 'product'
            }, {
                format: 'Units',
                columns: [{
                    columnId: 'weight'
                }, {
                    format: 'Custom Price',
                    columnId: 'price'
                }]
            }]
        },
        {
            format: 'Product info',
            columns: [{
                format: 'Meta',
                columns: [{
                    columnId: 'url'
                }, {
                    columnId: 'icon'
                }]
            }]
        }
    ],
    columns: [{
        id: 'weight',
        filtering: {
            condition: 'lessThan',
            value: 120
        }
    }, {
        id: 'product',
        filtering: {
            condition: 'beginsWith',
            value: 'ap'
        }
    }]
});
