const init = grid => {
    document
        .getElementById('sort-group')
        .addEventListener('click', () => {
            void grid.setSorting([
                { columnId: 'group', order: 'asc' }
            ]);
        });

    document
        .getElementById('sort-group-score')
        .addEventListener('click', () => {
            void grid.setSorting([
                { columnId: 'group', order: 'asc' },
                { columnId: 'score', order: 'asc' }
            ]);
        });

    document.getElementById('reset').addEventListener('click', () => {
        void grid.setSorting(null);
    });
};

const gridOrPromise = Grid.grid('container', {
    dataTable: {
        columns: {
            group: ['A', 'B', 'A', 'B', 'A'],
            score: [5, 4, 3, 2, 1],
            id: ['a', 'b', 'c', 'd', 'e']
        }
    },
    columnDefaults: {
        sorting: {
            enabled: true
        }
    },
    columns: [{
        id: 'group',
        header: {
            format: 'Group'
        }
    }, {
        id: 'score',
        header: {
            format: 'Score'
        }
    }, {
        id: 'id',
        header: {
            format: 'ID'
        }
    }]
}, true);

if (gridOrPromise && typeof gridOrPromise.then === 'function') {
    gridOrPromise.then(init);
} else {
    init(gridOrPromise);
}
