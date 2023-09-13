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
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
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
            Agriculture: 'y'
        },
        sync: {
            crossfilter: true
        },
        chartOptions: {
            title: {
                text: 'Agriculture'
            }
        }
    }, {
        cell: 'Top-middle',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Industry: 'y'
        },
        sync: {
            crossfilter: true
        },
        chartOptions: {
            title: {
                text: 'Industry'
            }
        }
    }, {
        cell: 'Top-right',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Services: 'y'
        },
        sync: {
            crossfilter: true
        },
        chartOptions: {
            title: {
                text: 'Services'
            }
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
        }
    }]
});
