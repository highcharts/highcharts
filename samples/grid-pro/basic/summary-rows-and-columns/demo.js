const products = ['Cloud', 'Devices', 'Services', 'Licenses'];

// Deterministic figures, so that the demo renders the same on every load.
function buildColumns(rowCount) {
    const columns = { account: [], q1: [], q2: [], q3: [], q4: [] };

    for (let i = 0; i < rowCount; ++i) {
        columns.account.push(products[i % products.length] + ' #' + (i + 1));
        columns.q1.push(600 + (i * 137) % 1800);
        columns.q2.push(600 + (i * 271) % 1800);
        columns.q3.push(600 + (i * 89) % 1800);
        columns.q4.push(600 + (i * 313) % 1800);
    }

    return columns;
}

Grid.grid('container', {
    data: {
        columns: buildColumns(200)
    },

    // Aggregate down: the rows are frozen below the scrollable body, so the
    // totals stay in view while scrolling the 200 rows.
    summaryRows: [{
        id: 'total',
        aggregator: 'SUM',
        columns: [
            { id: 'account', value: 'Total' },
            { id: 'avg', aggregator: 'AVERAGE' }
        ]
    }, {
        id: 'average',
        aggregator: 'AVERAGE',
        columns: [
            { id: 'account', value: 'Average' }
        ]
    }],

    columnDefaults: {
        width: 110,
        cells: {
            format: '{value:,.0f}',
            editMode: {
                enabled: true
            }
        }
    },

    columns: [{
        id: 'account',
        header: { format: 'Account' },
        width: 'auto',
        minWidth: 160,
        cells: { format: '{value}' }
    }, {
        id: 'q1',
        header: { format: 'Q1' }
    }, {
        id: 'q2',
        header: { format: 'Q2' }
    }, {
        id: 'q3',
        header: { format: 'Q3' }
    }, {
        id: 'q4',
        header: { format: 'Q4' }
    }, {
        // Aggregate across: no source column provides `total`, so the column
        // derives its value from the quarters of its own row. `materialize`
        // writes the result into the queried table, which makes it sortable.
        id: 'total',
        header: { format: 'Total' },
        columnAggregator: 'SUM',
        aggregatedColumns: ['q1', 'q2', 'q3', 'q4'],
        materialize: true
    }, {
        id: 'avg',
        header: { format: 'Avg / quarter' },
        width: 140,
        columnAggregator: 'AVERAGE',
        aggregatedColumns: ['q1', 'q2', 'q3', 'q4'],
        materialize: true,
        cells: { format: '{value:,.1f}' }
    }],

    header: ['account', 'q1', 'q2', 'q3', 'q4', 'total', 'avg']
});
