/* eslint-disable max-len */
const columns = {
    recordId: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34
    ],
    Regions: [
        'Sales',
        'Sales/EMEA',
        'Sales/EMEA/Germany',
        'Sales/EMEA/Germany/Enterprise',
        'Sales/EMEA/Germany/Mid-Market',
        'Sales/EMEA/France',
        'Sales/APAC',
        'Sales/APAC/Japan',
        'Sales/APAC/Japan/Enterprise',
        'Sales/Americas',
        'Sales/Americas/West',
        'Sales/Americas/West/Startup',
        'Marketing',
        'Marketing/Demand Gen',
        'Marketing/Demand Gen/ABM',
        'Marketing/Content',
        'Marketing/Content/Video',
        'Engineering',
        'Engineering/Frontend',
        'Engineering/Frontend/Platform',
        'Engineering/Frontend/Platform/Grid',
        'Engineering/Frontend/Applications',
        'Engineering/Backend',
        'Engineering/Backend/API',
        'Engineering/Backend/API/Auth',
        'Engineering/Backend/Data',
        'Engineering/DevOps',
        'Engineering/DevOps/Infrastructure',
        'Customer Success',
        'Customer Success/Support',
        'Customer Success/Support/Tier 1',
        'Customer Success/Support/Tier 2',
        'Finance',
        'Finance/RevOps'
    ],
    Budget: [
        4900, 2200, 1030, 560, 470, 1170, 1300, 620, 620, 1400, 480, 480, 1140,
        620, 620, 520, 520, 5660, 1660, 900, 900, 760, 2240, 760, 760, 1480,
        1760, 1760, 1760, 1760, 900, 860, 1200, 1200
    ],
    Actual: [
        4850, 2190, 1010, 590, 420, 1180, 1250, 650, 650, 1410, 500, 500, 1210,
        650, 650, 560, 560, 5690, 1710, 940, 940, 770, 2200, 720, 720, 1480,
        1780, 1780, 1810, 1810, 940, 870, 1180, 1180
    ],
    Headcount: [
        21, 9, 5, 3, 2, 4, 5, 2, 2, 7, 2, 2, 5, 3, 3, 2, 2, 24, 7, 4, 4, 3, 9,
        3, 3, 6, 8, 8, 8, 8, 4, 4, 5, 5
    ],
    Status: [
        null, null, null, 'Over', 'Under', 'Over', null, null, 'Over', null,
        null, 'Over', null, null, 'Over', null, 'Over', null, null, null,
        'Over', 'Over', null, null, 'Under', 'OK', null, 'Over', null, null,
        'Over', 'Over', null, 'Under'
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
            expandedRowIds: [1, 2, 3, 13] // Values from defined idColum above
        }
    },
    columnDefaults: {
        width: 150
    },
    columns: [{
        id: 'recordId',
        enabled: false
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
