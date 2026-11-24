Grid.grid('container', {
    data: {
        columns: {
            date: [
                Date.UTC(2025, 2, 1), Date.UTC(2025, 0, 1),
                Date.UTC(2025, 1, 1)
            ],
            region: ['North', 'South', 'East'],
            sales: [30, 10, 20],
            cost: [12, 4, 8]
        }
    },
    columns: [{
        id: 'date',
        dataType: 'datetime'
    }, {
        id: 'sales',
        header: { format: 'Sales' },
        cells: { format: '${value}k' }
    }]
});
