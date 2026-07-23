const shortColumns = {
    region: ['Americas', 'EMEA', 'APAC', 'LATAM'],
    q1: [1840, 1520, 1275, 640],
    q2: [1910, 1495, 1360, 705],
    q3: [1785, 1580, 1420, 690],
    q4: [2040, 1655, 1510, 760],
    growth: [0.12, 0.08, 0.15, 0.06]
};

// Generate a large dataset to show aggregation over many rows.
function createLargeColumns(rowCount) {
    const regions = ['Americas', 'EMEA', 'APAC', 'LATAM', 'MEA'];
    const columns = {
        region: [], q1: [], q2: [], q3: [], q4: [], growth: []
    };

    for (let i = 0; i < rowCount; ++i) {
        columns.region.push(regions[i % regions.length] + ' #' + (i + 1));
        columns.q1.push(Math.round(500 + Math.random() * 2000));
        columns.q2.push(Math.round(500 + Math.random() * 2000));
        columns.q3.push(Math.round(500 + Math.random() * 2000));
        columns.q4.push(Math.round(500 + Math.random() * 2000));
        columns.growth.push(Math.round(Math.random() * 30) / 100);
    }

    return columns;
}

const largeColumns = createLargeColumns(1000);

const grid = Grid.grid('container', {
    data: {
        columns: shortColumns
    },
    // Enable the flat summary (total) row.
    summaryRows: {
        enabled: true
    },
    rendering: {
        rows: {
            pinning: {
                enabled: true
            }
        }
    },
    columnDefaults: {
        width: 110,
        cells: {
            format: '${value:,0f}',
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'region',
        header: {
            format: 'Region'
        },
        width: 'auto',
        minWidth: 160,
        cells: {
            format: '{value}'
        },
        summary: {
            label: 'Total'
        }
    }, {
        id: 'q1',
        header: {
            format: 'Q1'
        },
        summary: {
            aggregator: 'SUM'
        }
    }, {
        id: 'q2',
        header: {
            format: 'Q2'
        },
        summary: {
            aggregator: 'SUM'
        }
    }, {
        id: 'q3',
        header: {
            format: 'Q3'
        },
        summary: {
            aggregator: 'SUM'
        }
    }, {
        id: 'q4',
        header: {
            format: 'Q4'
        },
        summary: {
            aggregator: 'SUM'
        }
    }, {
        id: 'growth',
        header: {
            format: 'Growth'
        },
        cells: {
            format: '{(multiply 100 value):.1f}%'
        },
        summary: {
            aggregator: 'AVERAGE'
        }
    }],
    header: [
        'region',
        'q1',
        'q2',
        'q3',
        'q4',
        'growth'
    ]
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
