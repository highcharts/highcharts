Dashboards.board(
    'container',
    {
        dataPool: {
            connectors: [
                {
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
                            [
                                'Rare',
                                'Uncommon',
                                'Uncommon',
                                'Increasing',
                                'More frequent',
                                'Frequent',
                                'Much more frequent',
                                'Common',
                                'Common, intense',
                                'Extreme'
                            ]
                        ]
                    }
                }
            ]
        },
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true
            }
        },
        components: [
            {
                renderTo: 'data-grid',
                connector: {
                    id: 'climate-data'
                },
                type: 'DataGrid',
                sync: {
                    highlight: true
                }
            },
            {
                sync: {
                    highlight: true
                },
                connector: {
                    id: 'climate-data',
                    columnAssignment: [
                        {
                            seriesId: 'Global Avg Temperature Increase',
                            data: ['Decade', 'Global Avg Temperature Increase']
                        }
                    ]
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
            },
            {
                sync: {
                    highlight: true
                },
                connector: {
                    id: 'climate-data',
                    columnAssignment: [
                        {
                            seriesId: 'CO2 Concentration',
                            data: ['Decade', 'CO2 Concentration']
                        }
                    ]
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
                            text: ''
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
            },
            {
                sync: {
                    highlight: true
                },
                connector: {
                    id: 'climate-data',
                    columnAssignment: [
                        {
                            seriesId: 'Sea Level Rise',
                            data: ['Decade', 'Sea Level Rise']
                        }
                    ]
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
                            text: ''
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
            },
            {
                sync: {
                    highlight: true
                },
                connector: {
                    id: 'climate-data',
                    columnAssignment: [
                        {
                            seriesId: 'Sea Level Rise',
                            data: ['Decade', 'Extreme Weather Events']
                        }
                    ]
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
                        }
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
            }
        ]
    },
    true
);
