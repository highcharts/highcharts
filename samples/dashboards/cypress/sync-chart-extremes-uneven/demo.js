Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'connector',
            type: 'CSV',
            options: {
                csv: `$GME,$AMC,$NOK
            4,5,6
            1,5,2
            41,23,2`,
                firstRowAsNames: true
            }
        }]
    },
    gui: {
        enabled: true,
        layouts: [{
            rows: [{
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
                minRange: 0.5,
                startOnTick: true,
                endOnTick: true
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
            }],
            series: [{
                name: 'test',
                data: [-1, 0, 2]
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
