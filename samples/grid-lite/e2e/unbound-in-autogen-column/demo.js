let i = 0;

Grid.grid('container', {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columns: [{
        id: 'weight',
        enabled: false
    }, {
        id: 'unbound',
        cells: {
            valueGetter: () => ++i
        }
    }]
});
