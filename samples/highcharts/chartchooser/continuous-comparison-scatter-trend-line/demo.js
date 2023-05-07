Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        HTML: true,
        text: 'Consumer Price Index vs Wages Increase (Norway)'
    },
    subtitle: {
        HTML: true,
        text:
        'Source: <a href="https://www.ssb.no/en/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen" target="_blank">SSB</a>'
    },

    xAxis: {
        title: {
            enabled: true,
            text: 'Consumer Price Index'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
        labels: {
            format: '{text}%'
        }
    },
    yAxis: {
        title: {
            text: 'Salary Increase'
        },
        labels: {
            format: '{text}%'
        }
    },

    plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: 'CPI: {point.x}% <br/> Wage Inc: {point.y}%'
            }
        }
    },
    legend: {
        enabled: true
    },
    series: [
        {
            name: '2011-2020',
            data: [
                [1.4, 0.4],
                [2.4, 5.3],
                [2.9, 4.9],
                [1.9, 3.4],
                [3.6, 1.9],
                [2.1, 3],
                [2, 4],
                [2, 5.6],
                [0.60, 6.3],
                [1.2, 6.3]
            ]
        }, {
            type: 'line',
            name: '2011-2020',
            color: '#2f7ed8',
            data: [[0.6, 5.189],
                [3.6, 2.9]],
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        },
        {
            name: '2001-2010',
            visible: false,
            data: [
                [2.2, 3.5],
                [1.9, 3.1],
                [3.2, 9.4],
                [0.6, 10.6],
                [1.9, 8.9],
                [1.3, 5.6],
                [0.3, 4.7],
                [2, 2.4],
                [1, 5.1],
                [2.2, 5.2]
            ]
        }, {
            type: 'line',
            name: '2001-2010',
            visible: false,
            color: '#0d233a',
            data: [[0.3, 5.88],
                [3.2, 5.82]],
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        },
        {
            name: '1991-2000',
            visible: false,
            data: [
                [2.3, 5.3],
                [1.7, 6.6],
                [1.6, 9.4],
                [1.7, 8.3],
                [0.9, 7],
                [1.6, 6],
                [0.9, 4.8],
                [1.4, 4.4],
                [1.5, 3.6],
                [2, 4.3]
            ]
        }, {
            type: 'line',
            name: '1991-2000',
            color: '#8bbc21',
            visible: false,
            data: [[0.9, 6.045],
                [2.3, 5.88]],
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        },
        {
            name: '1981-1990',
            data: [
                [2.4, 4.1],
                [2.5, 1.5],
                [3.4, 5.5],
                [4.2, 12.1],
                [3.2, 12.8],
                [2.3, 11.1],
                [2.5, 9.3],
                [3.1, 8.5],
                [3.7, 11.6],
                [3.9, 13.3]
            ]
        }, {
            type: 'line',
            name: '1991-2000',
            color: '#f7a35c',
            data: [[2.3, 6.25],
                [4.2, 12.57]],
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }
    ]
});
