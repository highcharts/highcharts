Grid.grid('container', {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            stock: [100, 40, 25, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    tableEditing: {
        enabled: true
    }
});
