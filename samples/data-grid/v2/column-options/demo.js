DataGrid.dataGrid2('container', {
    table: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    columns: {
        weight: {
            className: 'custom-column-class-name'
        },
        metaData: {
            enabled: false
        }
    }
});
