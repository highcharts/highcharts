Grid.grid('container', {
    data: {
        columns: {
            date: [Date.UTC(2022, 0, 1)],
            product: ['Apples']
        }
    },
    columns: [{
        id: 'date',
        cells: {
            formatter: function () {
                return new Date(this.value)
                    .toISOString()
                    .substring(0, 10);
            }
        }
    }]
});
