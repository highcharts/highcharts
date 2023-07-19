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
        max: 120,
        title: {
            text: null
        }
    },
    xAxis: {
        type: 'datetime'
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

const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    dataPool: {
        connectors: [{
            id: 'connector-1',
            type: 'CSV',
            options: {
                csv: csvData
            }
        }, {
            id: 'connector-2',
            type: 'CSV',
            options: {
                csv: csvData
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'title'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2'
                }]
            }, {
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
            cell: 'title',
            type: 'HTML',
            elements: [{
                tagName: 'h1',
                textContent: 'Polio (Pol3) immunization coverage'
            },
            {
                tagName: 'p',
                textContent: ' Among 1-year-olds (%) | Source: https://apps.who.int/gho/data/'
            }]
        },
        {
            cell: 'dashboard-col-1',
            type: 'Highcharts',
            connector: {
                id: 'connector-1'
            },
            sync: {
                extremes: true,
                highlight: true
            },
            columnAssignment: {
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
                    text: 'Global'
                },
                subtitle: {
                    text: ''
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'Highcharts',
            connector: {
                id: 'connector-1'
            },
            sync: {
                extremes: true,
                highlight: true
            },
            columnAssignment: {
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
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            }
        }, {
            cell: 'dashboard-col-3',
            type: 'Highcharts',
            connector: {
                id: 'connector-2'
            },
            sync: {
                extremes: true,
                highlight: true
            },
            columnAssignment: {
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
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            }
        }, {
            cell: 'dashboard-col-4',
            type: 'Highcharts',
            connector: {
                id: 'connector-2'
            },
            sync: {
                extremes: true,
                highlight: true
            },
            columnAssignment: {
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
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            }
        }
    ]
}, true);
