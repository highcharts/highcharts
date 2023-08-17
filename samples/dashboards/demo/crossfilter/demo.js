Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Economy',
            type: 'CSV',
            options: {
                csv: document.getElementById('csv').innerHTML,
                decimalPoint: '.',
                itemDelimiter: ','
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'Top-left'
                }, {
                    id: 'Top-middle'
                }, {
                    id: 'Top-right'
                }]
            }, {
                cells: [{
                    id: 'Bottom'
                }]
            }]
        }]
    },
    components: [{
        cell: 'Top-left',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Agriculture: 'Agriculture'
        },
        sync: {
            crossfilter: true,
            extremes: true
        }
    }, {
        cell: 'Top-middle',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Industry: 'Industry'
        },
        sync: {
            crossfilter: true,
            extremes: true
        }
    }, {
        cell: 'Top-right',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Services: 'Services'
        },
        sync: {
            crossfilter: true,
            extremes: true
        }
    }, {
        cell: 'Bottom',
        type: 'DataGrid',
        connector: {
            id: 'Economy'
        },
        dataGridOptions: {
            columns: {
                Agriculture: {
                    cellFormat: '{value:.1f}%'
                },
                Industry: {
                    cellFormat: '{value:.1f}%'
                },
                Services: {
                    cellFormat: '{value:.1f}%'
                }
            }
        },
        sync: {
            extremes: true
        }
    }]
});
