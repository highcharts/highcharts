const columns = {
    fruit: ['Apples', 'Pears', 'Plums'],
    count: [3, 5, 2]
};

Grid.grid('container', {
    data: {
        columns
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true
        }
    },
    pagination: {
        enabled: true
    }
});

Grid.grid('unthemed', {
    data: {
        columns
    },
    rendering: {
        theme: ''
    },
    columnDefaults: {
        cells: {
            className: 'my-cell'
        }
    }
});
