Grid.grid('container', {
    data: {
        columns: {
            product: [
                'Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Grapes'
            ],
            stock: [120, 40, 5, 200, 85, 60]
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true
        }
    },
    columns: [{
        id: 'product',
        filtering: {
            minLength: 3
        }
    }]
});
