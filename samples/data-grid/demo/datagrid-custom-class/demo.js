DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columnDefaults: {
        editable: true
    },
    columns: [{
        id: 'weight',
        className: 'custom-column-class-name'
    }]
});
