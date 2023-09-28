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
                columnNames: ['City', 'Population (mln)', 'Metro Area (km2)', 'Highest Elevation (m)'],
                firstRowAsNames: false,
                data
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0',
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '1/3'
                        },
                        large: {
                            width: '1/3'
                        }

                    }
                }, {
                    id: 'dashboard-col-1',
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '1/3'
                        },
                        large: {
                            width: '1/3'
                        }


                    }
                }, {
                    id: 'dashboard-col-2',
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '1/3'
                        },
                        large: {
                            width: '1/3'
                        }
                    }
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
            id: 'Population'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            City: 'x',
            'Population (mln)': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
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
                zoomType: 'x'
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
                pointFormat: '<b>{point.y:.2f}</b> mln'
            },
            legend: {
                enabled: false
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        title: {
            text: 'Metropolitan Area'
        },
        sync: {
            extremes: true
        },
        connector: {
            id: 'Population'
        },
        type: 'Highcharts',
        columnAssignment: {
            City: 'x',
            'Metro Area (km2)': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
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
                zoomType: 'x'
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b> km2'
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            }
        }
    },
    {
        cell: 'dashboard-col-2',
        connector: {
            id: 'Population'
        },
        title: {
            text: 'Highest Elevation'
        },
        sync: {
            extremes: true
        },
        type: 'Highcharts',
        columnAssignment: {
            City: 'x',
            'Highest Elevation (m)': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
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
                zoomType: 'x'
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b> m'
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            }
        }
    },
    {
        cell: 'dashboard-col-3',
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
