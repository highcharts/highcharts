Highcharts.addEvent(Highcharts.Chart, 'load', function () {
    if (this.options.chart.className.indexOf('rounded-plot-border') !== -1) {
        this.plotBorder.attr({
            rx: 10,
            ry: 10,
            zIndex: 6
        });
    }
});

Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        height: '90%',
        plotBorderWidth: 10,
        plotBorderColor: '#ffffff',
        backgroundColor: '#f7f7f8',
        spacing: [10, 85, 15, 20],
        style: {
            fontFamily: 'IBM Plex Sans'
        },
        className: 'rounded-plot-border'
    },
    legend: {
        enabled: false
    },
    annotations: [{
        draggable: false,
        shapeOptions: {
            type: 'path',
            strokeWidth: 0
        },
        shapes: [{
            fill: {
                radialGradient: {
                    cx: 0,
                    cy: 1,
                    r: 1.1
                },
                stops: [
                    [0, 'rgba(255, 0, 0, 0.2)'],
                    [1, 'rgba(255,255,255, 0.1)']
                ]
            },
            points: [{
                x: 96,
                y: 100,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 100,
                y: 100,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 100,
                y: 96,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 96,
                y: 96,
                xAxis: 0,
                yAxis: 0
            }]
        }, {
            fill: {
                radialGradient: {
                    cx: 0,
                    cy: 0,
                    r: 1.1
                },
                stops: [
                    [0, 'rgba(0, 0, 255, 0.1)'],
                    [1, 'rgba(255,255,255, 0.1)']
                ]
            },
            points: [{
                x: 96,
                y: 104,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 100,
                y: 104,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 100,
                y: 100,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 96,
                y: 100,
                xAxis: 0,
                yAxis: 0
            }]
        }, {
            fill: {
                radialGradient: {
                    cx: 1,
                    cy: 0,
                    r: 1.1
                },
                stops: [
                    [0, 'rgba(0, 255, 0, 0.1)'],
                    [1, 'rgba(255,255,255, 0.1)']
                ]
            },
            points: [{
                x: 100,
                y: 104,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 104,
                y: 104,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 104,
                y: 100,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 100,
                y: 100,
                xAxis: 0,
                yAxis: 0
            }]
        }, {
            fill: {
                radialGradient: {
                    cx: 1,
                    cy: 1,
                    r: 1.1
                },
                stops: [
                    [0, 'rgba(255, 255, 0, 0.2)'],
                    [1, 'rgba(255,255,255, 0.1)']
                ]
            },
            points: [{
                x: 100,
                y: 100,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 104,
                y: 100,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 104,
                y: 96,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 100,
                y: 96,
                xAxis: 0,
                yAxis: 0
            }]
        }],
        labelOptions: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            y: 0,
            padding: 10,
            style: {
                fontSize: '12px',
                fontWeight: 700,
                textOutline: '3px #ffffff80'
            }
        },
        labels: [{
            text: 'LAGGING',
            style: {
                color: '#c80056'
            },
            point: {
                x: 96,
                y: 96,
                xAxis: 0,
                yAxis: 0
            }
        }, {
            text: 'IMPROVING',
            style: {
                color: '#004bb3'
            },
            point: {
                x: 96,
                y: 104,
                xAxis: 0,
                yAxis: 0
            }
        }, {
            text: 'LEADING',
            style: {
                color: '#008224'
            },
            point: {
                x: 104,
                y: 104,
                xAxis: 0,
                yAxis: 0
            }
        }, {
            text: 'WEAKENING',
            style: {
                color: '#9a5c00'
            },
            point: {
                x: 104,
                y: 96,
                xAxis: 0,
                yAxis: 0
            }
        }]
    }],
    title: {
        text: 'Relative Rotation Graph®️'
    },
    plotOptions: {
        series: {
            lineWidth: 2,
            marker: {
                enabled: true,
                radius: 3,
                symbol: 'circle'
            }
        }
    },
    tooltip: {
        pointFormat: 'RS-Ratio®️: <b>{point.x}</b></br>' +
            'RS-Momentum®️: <b>{point.y}</b>'
    },
    xAxis: {
        min: 96,
        max: 104,
        plotLines: [{
            value: 100,
            width: 1,
            color: '#000000',
            zIndex: 1
        }],
        title: {
            text: 'JdK RS-Ratio®️',
            style: {
                fontWeight: 'bold'
            }
        },
        tickWidth: 0,
        lineWidth: 0,
        gridLineWidth: 1
    },
    yAxis: {
        min: 96,
        max: 104,
        plotLines: [{
            value: 100,
            width: 1,
            color: '#000000',
            zIndex: 1
        }],
        title: {
            text: 'JdK RS-Momentum®️',
            style: {
                fontWeight: 'bold'
            }
        },
        gridLineWidth: 1
    },
    series: [{
        name: 'Stock 1',
        color: '#9a5c00',
        data: [
            [102, 102],
            [102.25, 101.5],
            [102.5, 101],
            [102.875, 99.5],
            [102.625, 98.25],
            [102.375, 97.875],
            [101.75, 98],
            [101.375, 98]
        ]
    }, {
        name: 'Stock 2',
        color: '#004bb3',
        data: [
            [101.8, 98.3],
            [101.4, 97.5],
            [100.6, 97.25],
            [99.9, 97.625],
            [99.9, 98.5],
            [99.8, 99.75],
            [99.8, 100],
            [99.9, 102],
            [100, 102.5]
        ]
    }, {
        name: 'Stock 3',
        color: '#008224',
        data: [
            [98, 96.5],
            [97.2, 97],
            [97.1, 98],
            [97, 99],
            [97, 99.5],
            [97.05, 100],
            [97.1, 100.5],
            [97.15, 100.8],
            [97.2, 101.3],
            [97.3, 102],
            [97.4, 102.5],
            [97.8, 103],
            [98.1, 103.2],
            [98.6, 103.4],
            [99.1, 103.5],
            [99.6, 103.6],
            [100.4, 103.5]
        ]
    }, {
        name: 'Stock 4',
        color: '#008224',
        data: [
            [98.5, 98.5],
            [98.7, 99],
            [99, 99.3],
            [99.3, 100],
            [99.5, 100.5],
            [100, 101.3],
            [100.5, 101.8],
            [101.3, 103]
        ]
    }],
    navigation: {
        buttonOptions: {
            theme: {
                fill: 'none'
            },
            y: -7
        }
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                chart: {
                    spacing: [10, 10, 15, 10],
                    height: '100%',
                    plotBorderWidth: 7
                },
                title: {
                    style: {
                        fontSize: 13
                    }
                },
                plotOptions: {
                    series: {
                        label: {
                            enabled: false
                        }
                    }
                },
                xAxis: {
                    labels: {
                        distance: 6,
                        style: {
                            fontSize: '0.6em'
                        }
                    },
                    title: {
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                yAxis: {
                    labels: {
                        distance: 8,
                        style: {
                            fontSize: '0.6em'
                        }
                    },
                    title: {
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                }
            }
        }]
    }
});
