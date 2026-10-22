const columns = {
    fruit: ['Apples', 'Pears', 'Plums'],
    count: [3, 5, 2]
};

Grid.grid('container', {
    data: {
        columns
    }
});

Grid.grid('unthemed', {
    theme: '',
    data: {
        columns
    },
    columnDefaults: {
        cells: {
            className: 'my-cell'
        }
    }
});
