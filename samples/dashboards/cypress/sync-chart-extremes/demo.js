Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'connector',
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
            id: 'layout-1', // mandatory
            style: {
                fontSize: '1.5em',
                color: 'blue'
            },
            rows: [{
                // id: 'dashboard-row-0',
                cells: [
                    {
                        id: 'dashboard-col-0'
                    },
                    {
                        id: 'dashboard-col-1'
                    },
                    {
                        id: 'dashboard-col-2'
                    }
                ]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                animation: false,
                type: 'column',
                zoomType: 'x',
                panning: {
                    enabled: true
                },
                panKey: 'shift'
            },
            xAxis: [{
                minRange: 1,
                startOnTick: false,
                endOnTick: false
            }],
            accessibility: {
                keyboardNavigation: {
                    seriesNavigation: {
                        mode: 'serialize'
                    }
                }
            }
        },
        connector: {
            id: 'connector'
        },
        sync: {
            extremes: true
        }
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'column',
                animation: false,
                zoomType: 'x',
                zoomBySingleTouch: true
            },
            xAxis: [{
                minRange: 1
            }]
        },
        connector: {
            id: 'connector'
        },
        sync: {
            extremes: true
        }
    },
    {
        cell: 'dashboard-col-2',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                inverted: true,
                type: 'column',
                animation: false,
                zoomType: 'x',
                zoomBySingleTouch: true
            },
            xAxis: [{
                minRange: 1
            }]
        },
        connector: {
            id: 'connector'
        },
        sync: {
            extremes: true
        }
    }]
}, true);
