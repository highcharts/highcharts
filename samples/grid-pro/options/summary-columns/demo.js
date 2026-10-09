const shortColumns = {
    region: ['North', 'South', 'East', 'West'],
    q1: [120, 80, 95, 60],
    q2: [140, 85, 100, 75],
    q3: [130, 90, 110, 70],
    q4: [150, 95, 105, 90]
};

function createLargeColumns(rowCount) {
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const columns = { region: [], q1: [], q2: [], q3: [], q4: [] };

    for (let i = 0; i < rowCount; ++i) {
        columns.region.push(regions[i % regions.length] + ' #' + (i + 1));
        columns.q1.push(Math.round(50 + Math.random() * 200));
        columns.q2.push(Math.round(50 + Math.random() * 200));
        columns.q3.push(Math.round(50 + Math.random() * 200));
        columns.q4.push(Math.round(50 + Math.random() * 200));
    }

    return columns;
}

const largeColumns = createLargeColumns(1000);

const grid = Grid.grid('container', {
    data: {
        columns: shortColumns
    },
    columnDefaults: {
        filtering: {
            enabled: true
        },
        cells: {
            editMode: {
                enabled: true
            },
            format: '{value:,.0f}'
        }
    },
    columns: [{
        id: 'region',
        cells: {
            format: '{value}'
        }
    }, {
        // No source column provides `total`, so the column is unbound and
        // derives its value from the quarters of its own row. `materialize`
        // writes the result into the queried table.
        id: 'total',
        columnAggregator: 'SUM',
        aggregatedColumns: ['q1', 'q2', 'q3', 'q4'],
        materialize: true,
        header: {
            format: 'Total'
        }
    }, {
        // Without `materialize` only the rendered cells are resolved, which is
        // cheaper but keeps the column out of sorting and filtering.
        id: 'average',
        columnAggregator: 'AVERAGE',
        aggregatedColumns: ['q1', 'q2', 'q3', 'q4'],
        header: {
            format: 'Avg / quarter'
        },
        cells: {
            format: '{value:,.1f}'
        }
    }]
});

document.getElementById('large-dataset').addEventListener(
    'change',
    function (e) {
        grid.update({
            data: {
                columns: e.target.checked ? largeColumns : shortColumns
            }
        });
    }
);
