Grid.grid('container', {
    data: {
        connector: {
            type: 'JSON',
            data: [
                ['Product', 'Category', 'Price'],
                ['Apples', 'Fruit', 1.5],
                ['Pears', 'Fruit', 2.53],
                ['Carrots', 'Vegetable', 0.9],
                ['Potatoes', 'Vegetable', 1.2]
            ]
        }
    },
    columns: [{
        id: 'Price',
        cells: {
            format: '${value:.2f}'
        }
    }]
});
