Highcharts.setOptions({
    lang: {
        rangeSelectorZoom: ''
    }
});

Highcharts.stockChart('container', {

    chart: {
        backgroundColor: '#000000'
    },

    title: {
        text: 'BTCETH',
        align: 'left',
        y: 30,
        style: {
            color: '#b0abab',
            fontSize: '2em'
        }
    },

    xAxis: {
        lineWidth: 0,
        labels: {
            style: {
                color: '#b0abab'
            }
        },
        crosshair: {
            width: 0
        }
    },

    scrollbar: {
        barBorderRadius: 8,
        barBackgroundColor: '#5f5959',
        height: 8,
        margin: 0,
        trackBorderColor: '#5f5959',
        trackBorderRadius: 8
    },

    exporting: {
        buttons: {
            contextButton: {
                symbolStroke: '#d9d7d7',
                theme: {
                    fill: '#000000'
                }
            }
        }
    },

    yAxis: {
        gridLineWidth: 0,
        range: 20,
        offset: 30,
        labels: {
            style: {
                color: '#b0abab'
            }
        },
        accessibility: {
            description: 'price in Ethereum'
        }
    },

    navigator: {
        xAxis: {
            gridLineWidth: 0,
            labels: {
                style: {
                    color: '#ffffff',
                    opacity: 1,
                    textOutline: '#000000'
                }
            }
        },
        outlineWidth: 0,
        maskFill: 'rgba(181, 145, 143, 0.2)'
    },

    rangeSelector: {
        buttonPosition: {
            align: 'right',
            x: -30,
            y: -40
        },
        buttonSpacing: 10,
        buttonTheme: {
            fill: 'none',
            stroke: 'none',
            'stroke-width': 0,
            r: 8,
            style: {
                color: '#d9d7d7',
                fontWeight: 'bold',
                fontSize: '1em'
            },
            states: {
                select: {
                    fill: '#f23644',
                    style: {
                        color: '#ffffff'
                    }
                },
                hover: {
                    style: {
                        color: '#000000'
                    }
                }
            }
        },
        inputEnabled: false
    },

    plotOptions: {
        series: {
            fillColor: {
                linearGradient: [0, 0, 0, 450],
                stops: [
                    [0, '#5c0d13'],
                    [1, '#000000']
                ]
            }
        }
    },

    data: {
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@dac5bcf/samples/data/btc-eth.csv'
    },

    tooltip: {
        shape: 'rect',
        shadow: false,
        borderWidth: 0.5,
        borderColor: '#ffffff',
        backgroundColor: '#212020',
        style: {
            color: '#ffffff'
        }
    },

    series: [{
        type: 'area',
        color: '#f23644',
        tooltip: {
            valueDecimals: 4,
            pointFormat: '{point.y}'
        }
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 700
            },
            chartOptions: {
                title: {
                    align: 'center',
                    verticalAlign: 'top'
                },
                scrollbar: {
                    enabled: false
                },
                rangeSelector: {
                    buttonSpacing: 20,
                    buttonPosition: {
                        align: 'center',
                        x: 0,
                        y: 0
                    }
                }
            }
        }]
    }
});
