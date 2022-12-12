import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
const { CSVStore, PluginHandler } = Dashboard;

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

// Data.
const global = [73, 73, 74, 75, 76, 78, 79, 80, 82, 83, 83, 84, 84, 84, 85, 85,
        85, 85, 85, 86, 82, 80],
    africa = [54, 55, 59, 61, 62, 65, 66, 69, 71, 74, 72, 70, 71, 70, 71, 72,
        73, 73, 73, 74, 71, 70],
    europe = [94, 94, 93, 92, 95, 95, 95, 96, 96, 95, 95, 95, 95, 96, 94, 94,
        94, 93, 94, 95, 94, 94],
    seAsia = [64, 65, 65, 66, 66, 71, 72, 73, 75, 78, 80, 82, 83, 85, 87, 88,
        87, 90, 91, 90, 85, 82];

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

// Create store to sync charts.
const store = new CSVStore(void 0, {
    csv: ''
});
store.load();

const dashboard = new Dashboard.Dashboard('container', {
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
            store,
            sync: {
                selection: true,
                tooltip: true
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
                },
                xAxis: {
                    custom: {
                        syncGroup: 'x-wide'
                    }
                },
                series: [{
                    data: global,
                    name: 'Global'
                }]
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'Highcharts',
            store,
            sync: {
                selection: true,
                tooltip: true
            },
            chartOptions: {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'South-East Asia'
                },
                xAxis: {
                    custom: {
                        syncGroup: 'x-wide'
                    }
                },
                series: [{
                    data: seAsia,
                    name: 'South-East Asia'
                }]
            }
        }, {
            cell: 'dashboard-col-3',
            type: 'Highcharts',
            store,
            sync: {
                selection: true,
                tooltip: true
            },
            chartOptions: {
                chart: {
                    zoomType: 'y'
                },
                yAxis: {
                    custom: {
                        syncGroup: 'y'
                    }
                },
                title: {
                    text: 'Africa'
                },
                series: [{
                    data: africa,
                    name: 'Africa'
                }]
            }
        }, {
            cell: 'dashboard-col-4',
            type: 'Highcharts',
            store,
            sync: {
                selection: true,
                tooltip: true
            },
            chartOptions: {
                chart: {
                    zoomType: 'y'
                },
                yAxis: {
                    custom: {
                        syncGroup: 'y'
                    }
                },
                title: {
                    text: 'Europe'
                },
                series: [{
                    data: europe,
                    name: 'Europe'
                }]
            }
        }
    ]
});
