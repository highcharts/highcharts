Grid.grid('container', {
    data: {
        columns: {
            region: ['North', 'South', 'East', 'West'],
            q1: [120, 80, 95, 60],
            q2: [140, 85, 100, 75],
            q3: [130, 90, 110, 70],
            q4: [150, 95, 105, 90]
        }
    },
    columnDefaults: {
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
        // derives its value from the quarters of its own row.
        id: 'total',
        columnAggregator: 'SUM',
        aggregatedColumns: ['q1', 'q2', 'q3', 'q4'],
        header: {
            format: 'Total'
        }
    }, {
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
