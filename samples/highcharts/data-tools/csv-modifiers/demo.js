const csvData = document.getElementById('csv').innerHTML;

Highcharts.setOptions({
    chart: {
        zooming: {
            enabled: true,
            type: 'x'
        }
    },
    yAxis: {
        max: 5,
        min: -1
    },
    xAxis: {

        type: 'category'
    },
    tooltip: {
        pointFormat: '{series.name} had <b>{point.y:,.2f}%</b><br/> population growth in {point.name}'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    }
});

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'population-growth',
            type: 'CSV',
            options: {
                csv: csvData,
                firstColumnsAsNames: true,
                dataTable: {
                    aliases: {
                        0: 'Brazil',
                        1: 'Argentina',
                        2: 'Uruguay',
                        3: 'Paraguay',
                        4: 'United States',
                        5: 'Canada',
                        6: 'Mexico',
                        7: 'Guatemala',
                        8: 'China',
                        9: 'Japan',
                        10: 'India',
                        11: 'Indonesia'
                    }
                },
                dataModifier: {
                    type: 'Chain',
                    chain: [{
                        type: 'Invert'
                    }, {
                        type: 'Range',
                        ranges: [{
                            column: 'columnNames',
                            minValue: '1961',
                            maxValue: '2021'
                        }]
                    }]
                }
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'south-america-chart',
                    width: '1/3'
                }, {
                    width: '1/3',
                    id: 'north-america-chart'
                }, {
                    width: '1/3',
                    id: 'asia-chart'
                }]
            }, {
                cells: [{
                    id: 'legend'
                }]
            }]
        }]
    },
    components: [{
        cell: 'asia-chart',
        sync: {
            visibility: true,
            extremes: true
        },

        connector: {
            id: 'population-growth'
        },
        type: 'Highcharts',
        columnAssignment: {
            columnNames: 'x',
            China: 'y',
            Japan: 'y',
            India: 'y',
            Indonesia: 'y'
        },
        chartOptions: {
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00'],
            title: {
                text: 'Asia'
            },
            chart: {
                animation: false
            }
        }
    }, {
        cell: 'north-america-chart',

        sync: {
            visibility: true,
            extremes: true
        },
        connector: {
            id: 'population-growth'
        },
        type: 'Highcharts',
        columnAssignment: {
            columnNames: 'x',
            'United States': 'y',
            Canada: 'y',
            Mexico: 'y',
            Guatemala: 'y'
        },
        chartOptions: {
            title: {
                text: 'North America'
            },
            chart: {
                animation: false
            }
        }
    }, {
        cell: 'south-america-chart',

        sync: {
            visibility: true,
            extremes: true
        },
        connector: {
            id: 'population-growth'
        },
        type: 'Highcharts',
        columnAssignment: {
            columnNames: 'x',
            Brazil: 'y',
            Argentina: 'y',
            Uruguay: 'y',
            Paraguay: 'y'
        },
        chartOptions: {
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00'],
            title: {
                text: 'South America'
            },
            chart: {
                animation: false
            }
        }
    }, {
        cell: 'legend',

        connector: {
            id: 'population-growth'
        },
        type: 'Highcharts',
        columnAssignment: {
            columnNames: 'x',
            Brazil: 'y',
            Argentina: 'y',
            Uruguay: 'y',
            Paraguay: 'y',
            'United States': 'y',
            Canada: 'y',
            Mexico: 'y',
            Guatemala: 'y',
            China: 'y',
            Japan: 'y',
            India: 'y',
            Indonesia: 'y'
        },
        sync: {
            visibility: true
        },
        chartOptions: {
            chart: {
                height: 200
            },
            title: {
                text: 'Countries population growth by year'
            },
            tooltip: {

                enabled: false
            },
            plotOptions: {

                series: {
                    lineWidth: 0,
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    marker: {
                        enabled: false
                    }
                }
            },
            legend: {
                enabled: true,
                verticalAlign: 'middle',
                width: 1000,
                align: 'center',
                visible: false
            },
            xAxis: {
                width: 0,
                visible: false
            },
            yAxis: {
                height: 0,
                visible: false
            }
        }
    }]
},
true
);
