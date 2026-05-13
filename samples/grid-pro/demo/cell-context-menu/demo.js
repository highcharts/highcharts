Grid.grid('container', {
    data: {
        columns: {
            product: [
                'Apples',
                'Pears',
                'Plums',
                'Bananas',
                'Oranges'
            ],
            weight: [100, 40, 0.5, 200, 120],
            price: [1.5, 2.53, 5, 4.5, 3.2]
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    }
});
