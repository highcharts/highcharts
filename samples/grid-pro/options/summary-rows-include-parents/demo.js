// The dataset carries pre-calculated region totals, the way an export from a
// reporting system typically does: Europe 300 = 180 + 120, and so on.
const columns = {
    id: [
        'europe', 'france', 'germany',
        'asia', 'japan', 'korea',
        'americas', 'usa', 'brazil'
    ],
    parentId: [
        null, 'europe', 'europe',
        null, 'asia', 'asia',
        null, 'americas', 'americas'
    ],
    name: [
        'Europe', 'France', 'Germany',
        'Asia', 'Japan', 'Korea',
        'Americas', 'USA', 'Brazil'
    ],
    sales: [
        300, 180, 120,
        170, 110, 60,
        250, 160, 90
    ]
};

const grid = Grid.grid('container', {
    data: {
        columns,
        idColumn: 'id'
    },
    treeView: {
        enabled: true,
        treeColumn: 'name'
    },
    rendering: {
        rows: {
            expandedLevels: 'all'
        }
    },
    summaryRows: {
        aggregator: 'SUM',
        includeParents: false,
        columns: [{ id: 'name', value: 'Total' }]
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
        id: 'name',
        header: {
            format: 'Region'
        },
        width: 'auto',
        minWidth: 200,
        cells: {
            format: '{value}'
        }
    }, {
        id: 'sales',
        header: {
            format: 'Sales'
        },
        // Keeps the region rows in step with their countries while editing.
        rowAggregator: 'SUM'
    }],
    header: ['name', 'sales']
});

document.getElementById('include-parents').addEventListener(
    'change',
    function (e) {
        grid.update({
            summaryRows: {
                aggregator: 'SUM',
                includeParents: e.target.checked,
                columns: [{ id: 'name', value: 'Total' }]
            }
        });
    }
);
