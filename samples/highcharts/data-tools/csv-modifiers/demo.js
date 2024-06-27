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
        min: 1960,
        max: 2030
    },
    tooltip: {
        pointFormat: '{series.name} had <b>{point.y:,.2f}%</b><br/> ' +
            'population growth in {point.name}'
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

const asiaChart = {
    renderTo: 'asia-chart',
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
};

const northAmericaChart = {
    renderTo: 'north-america-chart',
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
};

const southAmericaChart = {
    renderTo: 'south-america-chart',
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
};

const legendChart = {
    renderTo: 'legend',
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
};


Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'population-growth',
            type: 'CSV',
            options: {
                csv: csvData,
                firstRowAsNames: true,
                firstColumnAsNames: false,
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
                        11: 'Indonesia',
                        12: 'Test'
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
                            minValue: 2010,
                            maxValue: 2012
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
                    id: 'south-america-chart'
                }, {
                    id: 'north-america-chart'
                }, {
                    id: 'asia-chart'
                }]
            }, {
                cells: [{
                    id: 'legend'
                }]
            }, {
                cells: [{
                    id: 'data-grid'
                }]
            }]
        }]
    },
    components: [
        // For debugging purposes
        {
            renderTo: 'data-grid',
            connector: {
                id: 'population-growth'
            },
            type: 'DataGrid'
        },
        asiaChart,
        northAmericaChart,
        southAmericaChart
        // legendChart
    ]
}, true);
