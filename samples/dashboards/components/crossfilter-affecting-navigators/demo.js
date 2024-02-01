const navigatorOptions = {
    xAxis: {
        labels: {
            format: '{value}%'
        },
        tickInterval: 10
    }
};

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
                    id: 'top-left'
                }, {
                    id: 'top-middle'
                }, {
                    id: 'top-right'
                }]
            }, {
                cells: [{
                    id: 'bottom'
                }]
            }]
        }]
    },
    components: [{
        cell: 'top-left',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Agriculture: 'y'
        },
        sync: {
            crossfilter: {
                enabled: true,
                affectNavigator: true
            }
        },
        chartOptions: {
            title: {
                text: 'Agriculture'
            },
            navigator: navigatorOptions
        }
    }, {
        cell: 'top-middle',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Industry: 'y'
        },
        sync: {
            crossfilter: {
                enabled: true,
                affectNavigator: true
            }
        },
        chartOptions: {
            title: {
                text: 'Industry'
            },
            navigator: navigatorOptions
        }
    }, {
        cell: 'top-right',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignments: {
            Services: 'y'
        },
        sync: {
            crossfilter: {
                enabled: true,
                affectNavigator: true
            }
        },
        chartOptions: {
            title: {
                text: 'Services'
            },
            navigator: navigatorOptions
        }
    }, {
        cell: 'bottom',
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
