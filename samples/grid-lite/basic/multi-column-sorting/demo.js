const init = grid => {
    document
        .getElementById('sort-group')
        .addEventListener('click', () => {
            void grid.setSorting([
                { columnId: 'Group', order: 'asc' }
            ]);
        });

    document
        .getElementById('sort-group-score')
        .addEventListener('click', () => {
            void grid.setSorting([
                { columnId: 'Group', order: 'asc' },
                { columnId: 'Score', order: 'asc' }
            ]);
        });

    document
        .getElementById('sort-group-score-id')
        .addEventListener('click', () => {
            void grid.setSorting([
                { columnId: 'Group', order: 'asc' },
                { columnId: 'Score', order: 'asc' },
                { columnId: 'ID', order: 'asc' }
            ]);
        });

    document.getElementById('reset').addEventListener('click', () => {
        void grid.setSorting(null);
    });
};

Grid.grid('container', {
    dataTable: {
        columns: {
            Group: ['B', 'A', 'B', 'A', 'A', 'B', 'A', 'B'],
            Score: [5, 3, 3, 5, 3, 5, 5, 3],
            ID: ['f', 'd', 'h', 'a', 'c', 'e', 'b', 'g']
        }
    },
    columnDefaults: {
        sorting: {
            enabled: true
        }
    }
}, true).then(init);
