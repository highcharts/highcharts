const weatherEvents = [
    'Rare',
    'Uncommon',
    'Increasing',
    'More frequent',
    'Frequent',
    'Much more frequent',
    'Common',
    'Common, intense',
    'Extreme'
];

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'climate-data',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                orientation: 'columns',
                columnNames: [
                    'Decade',
                    'Global Avg Temperature Increase',
                    'CO2 Concentration',
                    'Sea Level Rise',
                    'Extreme Weather Events'
                ],
                data: [
                    [
                        '1920-1929',
                        '1930-1939',
                        '1940-1949',
                        '1950-1959',
                        '1960-1969',
                        '1970-1979',
                        '1980-1989',
                        '1990-1999',
                        '2000-2009',
                        '2010-2019'
                    ],
                    [0.0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8],
                    [305, 310, 312, 315, 320, 327, 340, 355, 375, 400],
                    [0.0, 0.2, 0.4, 0.8, 1.0, 2.0, 3.0, 4.5, 6.0, 8.0],
                    [0, 1, 1, 2, 3, 4, 5, 6, 7, 8]
                ]
            }
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        },
        sidebar: {
            sticky: true
        }
    },
    components: [{
        renderTo: 'data-grid',
        connector: {
            id: 'climate-data'
        },
        type: 'DataGrid',
        sync: {
            highlight: true
        },
        dataGridOptions: {
            credits: {
                enabled: false
            },
            columns: [{
                id: 'Global Avg Temperature Increase',
                header: {
                    format: 'Global Avg Temperature Increase °C'
                }
            }, {
                id: 'CO2 Concentration',
                header: {
                    format: 'CO2 Concentration ppm'
                }
            }, {
                id: 'Sea Level Rise',
                header: {
                    format: 'Sea Level Rise cm'
                }
            }, {
                id: 'Extreme Weather Events',
                cells: {
                    formatter: function () {
                        return weatherEvents[this.value];
                    }
                }
            }]
        }
    }, {
        sync: {
            highlight: true
        },
        connector: {
            id: 'climate-data',
            columnAssignment: [{
                seriesId: 'Global Avg Temperature Increase',
                data: ['Decade', 'Global Avg Temperature Increase']
            }]
        },
        renderTo: 'temp-chart',
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Decades'
                }
            },
            yAxis: {
                title: {
                    text: '°C'
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                animation: false
            },
            title: {
                text: ''
            },
            tooltip: {
                valueSuffix: ' °C'
            }
        }
    }, {
        sync: {
            highlight: true
        },
        connector: {
            id: 'climate-data',
            columnAssignment: [{
                seriesId: 'CO2 Concentration',
                data: ['Decade', 'CO2 Concentration']
            }]
        },
        renderTo: 'co2-chart',
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Decades'
                }
            },
            yAxis: {
                title: {
                    text: 'ppm'
                },
                min: 250,
                max: 400
            },
            credits: {
                enabled: false
            },
            chart: {
                animation: false,
                type: 'column'
            },
            title: {
                text: ''
            }
        }
    }, {
        sync: {
            highlight: true
        },
        connector: {
            id: 'climate-data',
            columnAssignment: [{
                seriesId: 'Sea Level Rise',
                data: ['Decade', 'Sea Level Rise']
            }]
        },
        renderTo: 'sea-chart',
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Decades'
                }
            },
            yAxis: {
                title: {
                    text: 'cm'
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                animation: false,
                type: 'spline'
            },
            title: {
                text: ''
            }
        }
    }, {
        sync: {
            highlight: true
        },
        connector: {
            id: 'climate-data',
            columnAssignment: [{
                seriesId: 'Extreme Weather Events',
                data: ['Decade', 'Extreme Weather Events']
            }]
        },
        renderTo: 'events-chart',
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category',
                accessibility: {
                    description: 'Decades'
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                type: 'category',
                categories: weatherEvents
            },
            credits: {
                enabled: false
            },
            chart: {
                animation: false,
                type: 'scatter'
            },
            title: {
                text: ''
            }
        }
    }]
}, true);
