/*
* Scenarios:
* one chart has an extra series from options
* chart categories?
* one chart has a tableAxisMap
*
*/

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'connector-1',
            type: 'CSV',
            options: {
                csv: `$GME,$AMC,$NOK
                4,5,6
                1,5,2
                41,23,2`
            }
        }]
    },
    gui: {
        enabled: true,
        layouts: [{
            id: 'layout-1',
            style: {
                fontSize: '1.5em',
                color: 'blue'
            },
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false,
                type: 'column'
            },
            plotOptions: {
                series: {
                    animation: false
                }
            }
        },
        connector: {
            id: 'connector-1'
        },
        sync: {
            visibility: true
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            type: 'column',
            chart: {
                animation: false
            },
            plotOptions: {
                series: {
                    animation: false
                }
            }
        },
        connector: {
            id: 'connector-1'
        },
        sync: {
            visibility: true
        }
    }, {
        renderTo: 'dashboard-col-2',
        type: 'Highcharts',
        chartOptions: {
            type: 'column',
            chart: {
                animation: false
            },
            plotOptions: {
                series: {
                    animation: false
                }
            }
        },
        connector: {
            id: 'connector-1'
        },
        sync: {
            visibility: true
        }
    }]
}, true);
