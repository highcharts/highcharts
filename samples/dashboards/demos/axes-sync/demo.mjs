const { CSVStore } = Dashboards;

// Set global chart options.
Highcharts.setOptions({
    chart: {
        spacingTop: 20,
        spacingBottom: 20,
        height: 300,
        type: 'area',
        zoomType: 'xy'
    },
    yAxis: {
        title: {
            text: null
        },
        tickAmount: 4
    },
    xAxis: {
        type: 'datetime'
    },
    legend: {
        enabled: false
    },
    colors: ['#37D5D6'],
    plotOptions: {
        area: {
            pointStart: Date.UTC(2000, 0, 1),
            pointIntervalUnit: 'year',
            fillColor: {
                linearGradient: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 1
                },
                stops: [
                    [0, '#37D5D6'],
                    [1, '#37D5D600']
                ]
            }
        }
    }
});

const csvData = document.getElementById('csv').innerText,
    store1 = new CSVStore(void 0, {
        csv: csvData,
        firstRowAsNames: true
    }),
    store2 = new CSVStore(void 0, {
        csv: csvData,
        firstRowAsNames: true
    });

store1.load();
store2.load();

const dashboard = new Dashboards.Dashboard('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                id: 'dashboard-row-main',
                cells: [{
                    id: 'dashboard-col-1'
                }]
            }, {
                id: 'dashboard-row-1',
                cells: [{
                    id: 'dashboard-col-2'
                }]
            }, {
                id: 'dashboard-row-2',
                cells: [{
                    id: 'dashboard-col-3'
                }, {
                    id: 'dashboard-col-4'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-1',
            type: 'Highcharts',
            store: store1,
            sync: {
                selection: true,
                tooltip: true
            },
            tableAxisMap: {
                x: 'x',
                Europe: null,
                Africa: null,
                'South-East Asia': null
            },
            chartOptions: {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Polio (Pol3) immunization coverage among 1-year-olds (%) '
                },
                subtitle: {
                    text: 'Source: https://apps.who.int/gho/data/'
                }
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'Highcharts',
            store: store1,
            sync: {
                selection: true,
                tooltip: true
            },
            tableAxisMap: {
                x: 'x',
                Global: null,
                Europe: null,
                Africa: null
            },
            chartOptions: {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'South-East Asia'
                }
            }
        }, {
            cell: 'dashboard-col-3',
            type: 'Highcharts',
            store: store2,
            sync: {
                selection: true,
                tooltip: true
            },
            tableAxisMap: {
                x: 'x',
                Global: null,
                Europe: null,
                'South-East Asia': null
            },
            chartOptions: {
                chart: {
                    zoomType: 'y'
                },
                title: {
                    text: 'Africa'
                }
            }
        }, {
            cell: 'dashboard-col-4',
            type: 'Highcharts',
            store: store2,
            sync: {
                selection: true,
                tooltip: true
            },
            tableAxisMap: {
                x: 'x',
                Global: null,
                Africa: null,
                'South-East Asia': null
            },
            chartOptions: {
                chart: {
                    zoomType: 'y'
                },
                title: {
                    text: 'Europe'
                }
            }
        }
    ]
});
