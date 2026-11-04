const groupByOptions = {
    region: 'region',
    'region-segment': ['region', 'segment']
};

const grid = Grid.grid('container', {
    data: {
        columns: {
            region: [
                'Americas', 'Americas', 'Americas',
                'EMEA', 'EMEA', 'EMEA',
                'APAC', 'APAC'
            ],
            segment: [
                'Enterprise', 'Enterprise', 'Retail',
                'Enterprise', 'Retail', 'Retail',
                'Enterprise', 'Retail'
            ],
            account: [
                'Northwind Systems',
                'Bluefin Group',
                'Summit Outfitters',
                'Nordic Manufacturing',
                'Luma Foods',
                'Mercury Sports',
                'Pacific Logistics',
                'Harbor Retail'
            ],
            owner: [
                'Anne', 'Luis', 'Mia', 'Ola',
                'Vera', 'Tom', 'Kenji', 'Sara'
            ],
            revenue: [
                128000, 98000, 74000, 112000,
                68000, 54000, 88000, 62000
            ],
            units: [
                42, 31, 27, 39,
                22, 19, 28, 21
            ],
            margin: [
                0.31, 0.28, 0.24, 0.34,
                0.27, 0.22, 0.30, 0.25
            ]
        }
    },
    rowGrouping: {
        enabled: true,
        groupBy: groupByOptions['region-segment']
    },
    rendering: {
        rows: {
            expandedLevels: 'all'
        }
    },
    columns: [{
        id: 'account',
        header: {
            format: 'Account'
        },
        width: 170
    }, {
        id: 'owner',
        header: {
            format: 'Owner'
        },
        width: 90
    }, {
        id: 'revenue',
        header: {
            format: 'Revenue'
        },
        cells: {
            format: '${value:,0f}'
        },
        rowAggregator: 'SUM'
    }, {
        id: 'units',
        header: {
            format: 'Units'
        },
        cells: {
            format: '{value:,0f}'
        },
        rowAggregator: 'SUM'
    }, {
        id: 'margin',
        header: {
            format: 'Margin'
        },
        cells: {
            format: '{(multiply 100 value):.1f}%'
        },
        rowAggregator: 'AVERAGE'
    }]
});

document.getElementById('grouping-mode').addEventListener('change', e => {
    grid.update({
        rowGrouping: {
            groupBy: groupByOptions[e.target.value]
        },
        rendering: {
            rows: {
                expandedLevels: 'all'
            }
        }
    });
});

document.getElementById('expand-all').addEventListener('click', () => {
    grid.treeView?.expandAll();
});

document.getElementById('collapse-all').addEventListener('click', () => {
    grid.treeView?.collapseAll();
});
