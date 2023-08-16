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
                    id: 'Top'
                }]
            }, {
                cells: [{
                    id: 'Middle-left'
                }, {
                    id: 'Middle-middle'
                }, {
                    id: 'Middle-right'
                }]
            }, {
                cells: [{
                    id: 'Bottom'
                }]
            }]
        }]
    },
    components: [{
        cell: 'Top',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Year: 'Economy'
        },
        sync: {
            crossfilter: true,
            extremes: true
        },
        chartOptions: {
            chart: {
                height: 100
            }
        }
    }, {
        cell: 'Middle-left',
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
        cell: 'Middle-middle',
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
        cell: 'Middle-right',
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
        sync: {
            extremes: true
        }
    }]
});
