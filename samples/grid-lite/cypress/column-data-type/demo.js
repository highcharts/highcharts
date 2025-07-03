Grid.grid('container', {
    dataTable: {
        columns: {
            string: ['Apples', 'Pears', 'Plums', 'Bananas'],
            booleans: [true, false, null, false],
            boolNumber: [1, 0, null, 0],
            int: [1, 2, 3, 4],
            float: [1.5, 2.53, 5, 4.5],
            date: [
                Date.UTC(2023, 0, 1),
                Date.UTC(2023, 0, 2),
                null,
                Date.UTC(2023, 0, 4)
            ]
        }
    },
    columns: [{
        id: 'boolNumber',
        dataType: 'boolean'
    }, {
        id: 'date',
        dataType: 'datetime'
    }]
});
