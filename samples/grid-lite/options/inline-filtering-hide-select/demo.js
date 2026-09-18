Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5, 6],
            product: [
                'Apples',
                'Pears',
                'Plums',
                'Bananas',
                'Oranges',
                'Grapes'
            ],
            category: [
                'Fruit',
                'Fruit',
                'Fruit',
                'Tropical',
                'Citrus',
                'Berry'
            ],
            stock: [120, 40, 5, 200, 85, 60],
            price: [1.5, 2.53, 5, 4.5, 3.2, 6.75]
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true,
            hideOperatorSelect: true
        }
    },
    columns: [{
        id: 'id',
        width: 60
    }, {
        id: 'product',
        dataType: 'string',
        filtering: {
            operators: ['contains']
        }
    }, {
        id: 'stock',
        filtering: {
            operators: ['greaterThan', 'lessThan']
        }
    }, {
        id: 'price',
        filtering: {
            operators: ['greaterThan']
        },
        cells: {
            format: '${value:.2f}'
        }
    }]
});
