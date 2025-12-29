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

    document.getElementById('reset').addEventListener('click', () => {
        void grid.setSorting(null);
    });
};

const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            Group: ['A', 'B', 'A', 'B', 'A'],
            Score: [5, 4, 3, 2, 1],
            ID: ['a', 'b', 'c', 'd', 'e']
        }
    },
    columnDefaults: {
        sorting: {
            enabled: true
        }
    }
}, true);

init(grid);
