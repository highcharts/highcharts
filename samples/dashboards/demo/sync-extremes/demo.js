const data = [
    ['Delhi', 31.18, 1484, 250],
    ['Tokyo', 37.33, 2194, 2017],
    ['Shanghai', 27.79, 14922, 118],
    ['Sao Paulo', 22.23, 7946, 760],
    ['Mexico City', 21.91, 1485, 3930],
    ['Dhaka', 21.74, 2161, 32],
    ['Cairo', 21.32, 2734, 23],
    ['Beijing', 20.89, 12796, 2303],
    ['Mumbai', 20.67, 4355, 14],
    ['Osaka', 19.11, 225, 3],
    ['Karachi', 16.45, 3530, 10],
    ['Chongqing', 16.38, 5472, 2797],
    ['Istanbul', 15.41, 5343, 537],
    ['Buenos Aires', 15.25, 4758, 25],
    ['Kolkata', 14.974, 1886, 9],
    ['Kinshasa', 14.97, 9965, 240],
    ['Lagos', 14.86, 2706, 41],
    ['Manila', 14.16, 619, 108],
    ['Tianjin', 13.79, 5609, 1078],
    ['Guangzhou', 13.64, 19870, 21]
];

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Population',
            type: 'JSON',
            options: {
                columnNames: [
                    'City', 'Population (mln)', 'Metro Area (km²)',
                    'Highest Elevation (m)'
                ],
                firstRowAsNames: false,
                data
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-3'
                }]
            }]
        }]
    },
    components: [{
        title: {
            text: 'Population'
        },
        sync: {
            extremes: true
        },
        connector: {
            id: 'Population',
            columnAssignment: [{
                seriesId: 'Population (mln)',
                data: ['City', 'Population (mln)']
            }]
        },
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Cities'
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'bar',
                zooming: {
                    type: 'x'
                }
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '<b>{point.y:.2f}</b> mln',
                stickOnContact: true
            },
            legend: {
                enabled: false
            },
            lang: {
                accessibility: {
                    chartContainerLabel: 'Population, Highcharts interactive ' +
                        'chart.'
                }
            },
            accessibility: {
                description: `The chart is displaying the Population of cities.
                The values are introduced in millions.`
            }
        }
    },
    {
        renderTo: 'dashboard-col-1',
        title: {
            text: 'Metropolitan Area'
        },
        sync: {
            extremes: true
        },
        connector: {
            id: 'Population',
            columnAssignment: [{
                seriesId: 'Metro Area (km²)',
                data: ['City', 'Metro Area (km²)']
            }]
        },
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Cities'
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'bar',
                zooming: {
                    type: 'x'
                }
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b> km²',
                stickOnContact: true
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            lang: {
                accessibility: {
                    chartContainerLabel: 'Metropolitan Area, Highcharts ' +
                        'interactive chart.'
                }
            },
            accessibility: {
                description: `The chart is displaying the Metropolitan area.
                The values are introduced in square kilometers.`
            }
        }
    },
    {
        renderTo: 'dashboard-col-2',
        connector: {
            id: 'Population',
            columnAssignment: [{
                seriesId: 'Highest Elevation (m)',
                data: ['City', 'Highest Elevation (m)']
            }]
        },
        title: {
            text: 'Highest Elevation'
        },
        sync: {
            extremes: true
        },
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Cities'
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'bar',
                zooming: {
                    type: 'x'
                }
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b> m',
                stickOnContact: true
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            lang: {
                accessibility: {
                    chartContainerLabel: 'Highest Elevation, Highcharts ' +
                        'interactive chart.'
                }
            },
            accessibility: {
                description: `The chart is displaying the Highest Elevation of
                    cities. The values are introduced in meters.`
            }
        }
    },
    {
        renderTo: 'dashboard-col-3',
        connector: {
            id: 'Population'
        },
        type: 'DataGrid',
        sync: {
            extremes: true
        },
        dataGridOptions: {
            editable: false
        }
    }]
}, true);
