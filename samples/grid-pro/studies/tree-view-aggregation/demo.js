/* eslint-disable max-len */
const columns = {
    recordId: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
    ],
    Regions: [
        'Sales/EMEA/Germany/Enterprise',
        'Sales/EMEA/Germany/Mid-Market',
        'Sales/EMEA/France',
        'Sales/APAC/Japan/Enterprise',
        'Sales/Americas/West/Startup',
        'Marketing/Demand Gen/ABM',
        'Marketing/Content/Video',
        'Engineering/Frontend/Platform/Grid',
        'Engineering/Frontend/Applications',
        'Engineering/Backend/API/Auth',
        'Engineering/Backend/Data',
        'Engineering/DevOps/Infrastructure',
        'Customer Success/Support/Tier 1',
        'Customer Success/Support/Tier 2',
        'Finance/RevOps'
    ],
    Budget: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    Actual: [
        1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1
    ],
    Headcount: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    Status: [
        'Over', 'Under', 'Over', 'Over',
        'Over', 'Over', 'Over', 'Over',
        'Over', 'Under', 'OK', 'Over',
        'Over', 'Over', 'Under'
    ]
};

Grid.grid('container', {
    data: {
        columns,
        idColumn: 'recordId',
        treeView: {
            input: {
                type: 'path',
                pathColumn: 'Regions' // Column that contains the path
            },
            expandedRowIds: [1, 2, 3, 13] // Values from defined idColumn above
        }
    },
    columnDefaults: {
        width: 150
    },
    columns: [{
        id: 'recordId',
        enabled: false
    }, {
        id: 'Budget',
        treeView: {
            aggregate: 'SUM'
        }
    }, {
        id: 'Actual',
        cells: {
            format: '{value:.2f}'
        },
        treeView: {
            aggregate: 'AVERAGE'
        }
    }, {
        id: 'Regions',
        width: 'auto'
    }, {
        id: 'Status',
        className: 'hcg-center',
        cells: {
            formatter() {
                const value = this.value;

                if (value !== null) {
                    return `<span class="status ${value.toLowerCase()}">${value}</span>`;
                }
            }
        }
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 700
            },
            gridOptions: {
                header: ['Regions', 'Budget', 'Actual'],
                columnDefaults: {
                    width: 100
                }
            }
        }]
    }
});
