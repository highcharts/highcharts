// Set global chart options.
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
                Global: 'y'
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
