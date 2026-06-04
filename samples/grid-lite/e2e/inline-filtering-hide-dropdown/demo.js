window.grid = Grid.grid('container', {
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
            ]
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true,
            hideDropdown: true
        }
    },
    columns: [{
        id: 'product',
        dataType: 'string'
    }, {
        id: 'category',
        dataType: 'string',
        filtering: {
            operators: ['contains', 'beginsWith']
        }
    }]
});
