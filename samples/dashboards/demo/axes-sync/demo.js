const data = [
    ['x', 'Global', 'Africa', 'Europe', 'South-East Asia'],
    [946684800000, 73, 54, 94, 64],
    [978307200000, 73, 55, 94, 65],
    [1009843200000, 74, 59, 93, 65],
    [1041379200000, 75, 61, 92, 66],
    [1072915200000, 76, 62, 95, 66],
    [1104537600000, 78, 65, 95, 71],
    [1136073600000, 79, 66, 95, 72],
    [1167609600000, 80, 69, 96, 73],
    [1199145600000, 82, 71, 96, 75],
    [1230768000000, 83, 74, 95, 78],
    [1262304000000, 83, 72, 95, 80],
    [1293840000000, 84, 70, 95, 82],
    [1325376000000, 84, 71, 95, 83],
    [1356998400000, 84, 70, 96, 85],
    [1388534400000, 85, 71, 94, 87],
    [1420070400000, 85, 72, 94, 88],
    [1451606400000, 85, 73, 94, 87],
    [1483228800000, 85, 73, 93, 90],
    [1514764800000, 85, 73, 94, 91],
    [1546300800000, 86, 74, 95, 90],
    [1577836800000, 82, 71, 94, 85],
    [1609459200000, 80, 70, 94, 82]
];
Highcharts.setOptions({
    chart: {
        spacingTop: 20,
        spacingBottom: 20,
        height: 300,
        type: 'area',
        zoomType: 'xy'
    },
    legend: {
        enabled: false
    },
    tooltip: {
        valueSuffix: '%'
    },
    yAxis: {
        max: 100,
        title: {
            text: null
        },
        labels: {
            format: '{value}%'
        }
    },
    xAxis: {
        type: 'datetime'
    }
});

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
            type: 'JSON',
            options: {
                data
            }
        }, {
            id: 'connector-2',
            type: 'JSON',
            options: {
                data
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
                tagName: 'div',
                children: [{
                    tagName: 'a',
                    href: 'https://apps.who.int/gho/data/',
                    class: 'subtitle',
                    textContent: 'Among 1-year-olds (%)'

                }]
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
                Global: 'y'
            },
            chartOptions: {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Global'
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
                'South-East Asia': 'y'
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
                },
                plotOptions: {
                    series: {
                        colorIndex: 1
                    }
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
                Africa: 'y'
            },
            chartOptions: {
                chart: {
                    zoomType: 'y'
                },
                title: {
                    text: 'Africa'
                },
                plotOptions: {
                    series: {
                        colorIndex: 2
                    }
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
                Europe: 'y'
            },
            chartOptions: {
                chart: {
                    zoomType: 'y'
                },
                title: {
                    text: 'Europe'
                },
                plotOptions: {
                    series: {
                        colorIndex: 3
                    }
                }
            }
        }
    ]
}, true);
