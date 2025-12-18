const sortStateEl = document.getElementById('sort-state');
const setSortState = text => {
    if (sortStateEl) {
        sortStateEl.textContent = text;
    }
};

const init = grid => {
    const apply = (sortings, label) => {
        grid.querying.sorting.setSorting(sortings);
        if (!grid.viewport) {
            return;
        }
        void grid.viewport.updateRows().then(() => {
            setSortState(label);
        });
    };

    document
        .getElementById('sort-group')
        .addEventListener('click', () => {
            grid.querying.sorting.setSorting('asc', 'group');
            if (!grid.viewport) {
                return;
            }
            void grid.viewport.updateRows().then(() => {
                setSortState('Group (asc)');
            });
        });

    document
        .getElementById('sort-group-score')
        .addEventListener('click', () => {
            apply([
                { columnId: 'group', order: 'asc' },
                { columnId: 'score', order: 'asc' }
            ], 'Group (asc), Score (asc)');
        });

    document.getElementById('reset').addEventListener('click', () => {
        apply(null, 'none');
    });

    setSortState('none');
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
