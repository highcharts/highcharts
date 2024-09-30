const weatherEventsMap = [
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

Highcharts.setOptions({
    chart: {
        animation: false,
        spacing: [40, 40, 20, 40],
        borderRadius: 5
    },
    credits: {
        enabled: false
    },
    title: {
        text: ''
    },
    tooltip: {
        shared: true
    }
});

const pointFormatter = function () {
    const series = this.series;
    return `<span style="color:{point.color}">\u25CF</span>
    ${series.name}: <b>${weatherEventsMap[this.y]}</b><br/>`;
};

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
                    'Extreme Weather Events',
                    'Mapped events'
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
                ],
                beforeParse: function (data) {
                    data.push(data[4].map(function (event) {
                        return weatherEventsMap.indexOf(event);
                    }));
                    return data;

                }
            }
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    components: [{
        renderTo: 'data-grid',
        connector: {
            id: 'climate-data'
        },
        type: 'DataGrid',
        dataGridOptions: {
            credits: {
                enabled: false
            },
            columns: [{
                id: 'Global Avg Temperature Increase',
                header: {
                    format: 'Average Temperature Increase'
                },
                cells: {
                    format: '{value} °C'
                }
            }, {
                id: 'CO2 Concentration',
                header: {
                    format: 'CO2 Concentration'
                },
                cells: {
                    format: '{value} ppm'
                }
            }, {
                id: 'Sea Level Rise',
                header: {
                    format: 'Sea Level Rise'
                },
                cells: {
                    format: '{value} cm'
                }
            }, {
                id: 'Mapped events',
                enabled: false
            }]
        },
        sync: {
            highlight: true
        }
    }, {
        connector: {
            id: 'climate-data',
            columnAssignment: [{
                seriesId: 'temp',
                data: ['Decade', 'Global Avg Temperature Increase']
            }, {
                seriesId: 'events',
                data: ['Decade', 'Mapped events']
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
            yAxis: [{
                title: {
                    text: '°C'
                }
            }, {
                title: {
                    text: ''
                },
                visible: false
            }],
            tooltip: {
                valueSuffix: ' °C'
            },
            series: [{
                id: 'temp',
                name: 'Global Average Temperature Increase',
                type: 'column',
                yAxis: 0,
                tooltip: {
                    valueSuffix: ' °C'
                }
            }, {
                id: 'events',
                yAxis: 1,
                name: 'Extreme Weather Events',
                tooltip: {
                    pointFormatter: pointFormatter
                }
            }]
        },
        sync: {
            highlight: true
        }
    }, {
        connector: {
            id: 'climate-data',
            columnAssignment: [{
                seriesId: 'co2',
                data: ['Decade', 'CO2 Concentration']
            }, {
                seriesId: 'events',
                data: ['Decade', 'Mapped events']
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
            yAxis: [{
                title: {
                    text: 'ppm'
                },
                min: 250,
                max: 400
            }, {
                title: {
                    text: ''
                },
                visible: false
            }],
            series: [{
                id: 'co2',
                name: 'CO2 Concentration',
                type: 'column',
                yAxis: 0,
                tooltip: {
                    valueSuffix: ' ppm'
                }
            }, {
                id: 'events',
                yAxis: 1,
                name: 'Extreme Weather Events',
                tooltip: {
                    pointFormatter: pointFormatter
                }
            }]
        },
        sync: {
            highlight: true
        }
    }, {
        connector: {
            id: 'climate-data',
            columnAssignment: [{
                seriesId: 'sea-level-rise',
                data: ['Decade', 'Sea Level Rise']
            }, {
                seriesId: 'events',
                data: ['Decade', 'Mapped events']
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
            yAxis: [{
                title: {
                    text: 'cm'
                }
            }, {
                title: {
                    text: ''
                },
                visible: false
            }],
            series: [{
                id: 'sea-level-rise',
                type: 'column',
                yAxis: 0,
                name: 'Sea Level Rise',
                tooltip: {
                    valueSuffix: ' cm'
                }
            }, {
                id: 'events',
                yAxis: 1,
                name: 'Extreme Weather Events',
                tooltip: {
                    pointFormatter: pointFormatter
                }
            }]
        },
        sync: {
            highlight: true
        }
    }]
}, true);
