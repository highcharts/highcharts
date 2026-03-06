const scoreCompare = (a, b) => (b || 0) - (a || 0);

Grid.grid('container', {
    dataTable: {
        columns: {
            group: ['A', 'A', 'A', 'B', 'B', 'B', 'A', 'B'],
            score: [2, 1, 3, 1, 3, 2, 1, 2],
            id: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        }
    },
    columns: [{
        id: 'score',
        sorting: {
            compare: scoreCompare
        }
    }]
});
