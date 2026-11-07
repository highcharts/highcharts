Grid.grid('container', {
    data: {
        columns: {
            product: [],
            stock: [],
            price: []
        }
    },
    columns: [{
        id: 'product',
        dataType: 'string'
    }, {
        id: 'stock',
        dataType: 'number'
    }, {
        id: 'price',
        dataType: 'number'
    }],
    tableEditing: {
        enabled: true
    }
});
