const csv = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Population',
            type: 'CSV',
            options: {
                csv,
                firstRowAsNames: true
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
                        }
                    }
                }, {
                    id: 'dashboard-col-1',
                    responsive: {
                        small: {
                            width: '100%'
                        }

                    }
                }, {
                    id: 'dashboard-col-2',
                    responsive: {
                        small: {
                            width: '100%'
                        }
                    }
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-3',
                    height: 140
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-4'
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
            Town: 'x',
            Population: 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category',
                labels: {
                    enabled: false
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
                type: 'column',
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
            subtitle: {
                text: 'Millions',
                align: 'left',
                y: 0
            },
            legend: {
                enabled: false
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        title: {
            text: 'Metropolitan area'
        },
        sync: {
            extremes: true
        },
        connector: {
            id: 'Population'
        },
        type: 'Highcharts',
        columnAssignment: {
            Town: 'x',
            'Metro Area(km2)': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category',
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Area km2'
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'column',
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
            subtitle: {
                text: 'km2',
                align: 'left',
                y: 0
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
            Town: 'x',
            'Highest Elevation(m)': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category',
                labels: {
                    enabled: false
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
                type: 'column',
                zoomType: 'x'
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                },
                tooltip: {
                    headerFormat: '{point.key}',
                    format: '{y}'
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: 'Meters',
                align: 'left',
                y: 0
            },
            legend: {
                enabled: false
            }
        }
    },
    {
        title: {
            text: ''
        },
        cell: 'dashboard-col-3',
        type: 'Highcharts',
        connector: {
            id: 'Population'
        },
        columnAssignment: {
            Town: 'x',
            Population: null,
            'Metro Area(km2)': null,
            'Highest Elevation(m)': 'y'
        },
        chartOptions: {
            xAxis: {
                visible: false
            },
            yAxis: {
                title: {
                    text: ''
                },
                height: 0
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'column',
                margin: 0,
                spacing: 0
            },
            plotOptions: {
                series: {
                    legendType: 'point',
                    colorByPoint: true,
                    marker: {
                        symbol: 'square'
                    },
                    events: {
                        legendItemClick: function () {
                            return false;
                        }
                    },
                    states: {
                        inactive: {
                            enabled: false
                        }
                    }
                }
            },
            title: {
                text: ''
            },
            legend: {
                title: {
                    text: 'Cities'
                },
                enabled: true,
                padding: 0,
                floating: true,
                y: -30,
                navigation: {
                    enabled: false
                }
            }
        }
    },
    {
        cell: 'dashboard-col-4',
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
