Grid.grid('container', {
    caption: {
        text: 'My First Grid'
    },
    description: {
        text: 'This is a table presenting a list of fruits with their weight' +
            ' and price.'
    },
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    }
});
