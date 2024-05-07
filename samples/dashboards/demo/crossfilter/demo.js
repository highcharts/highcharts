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
        renderTo: 'top-left',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignment: {
            Agriculture: 'y'
        },
        sync: {
            crossfilter: true
        },
        chartOptions: {
            title: {
                text: 'Agriculture'
            },
            navigator: navigatorOptions
        }
    }, {
        renderTo: 'top-middle',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignment: {
            Industry: 'y'
        },
        sync: {
            crossfilter: true
        },
        chartOptions: {
            title: {
                text: 'Industry'
            },
            navigator: navigatorOptions
        }
    }, {
        renderTo: 'top-right',
        type: 'Navigator',
        connector: {
            id: 'Economy'
        },
        columnAssignment: {
            Services: 'y'
        },
        sync: {
            crossfilter: true
        },
        chartOptions: {
            title: {
                text: 'Services'
            },
            navigator: navigatorOptions
        }
    }, {
        renderTo: 'bottom',
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
