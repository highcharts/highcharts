// Configuring the style of the chart
Highcharts.setOptions({
    lang: {
        rangeSelectorZoom: ''
    },

    chart: {
        backgroundColor: '#000000',
        zooming: {
            resetButton: {
                theme: {
                    fill: '#f23644',
                    stroke: 'none',
                    style: {
                        color: '#ffffff'
                    },
                    r: 8,
                    states: {
                        hover: {
                            style: {
                                color: '#000000'
                            }
                        }
                    }
                }
            }
        }
    },

    title: {
        style: {
            color: '#b0abab',
            fontSize: '2em'
        }
    },

    xAxis: {
        labels: {
            style: {
                color: '#b0abab'
            }
        }
    },

    yAxis: {
        labels: {
            style: {
                color: '#b0abab'
            }
        }
    },

    navigator: {
        series: {
            fillColor: {
                linearGradient: [0, 0, 0, 40],
                stops: [
                    [0, '#5c0d13'],
                    [1, '#000000']
                ]
            }
        },
        xAxis: {
            labels: {
                style: {
                    color: '#ffffff',
                    opacity: 1,
                    textOutline: '#000000'
                }
            }
        },
        maskFill: 'rgba(181, 145, 143, 0.2)',
        handles: {
            backgroundColor: '#5f5959',
            borderRadius: '50%',
            width: 20,
            height: 20
        }
    },

    exporting: {
        buttons: {
            contextButton: {
                symbolStroke: '#d9d7d7',
                theme: {
                    fill: '#000000',
                    states: {
                        hover: {
                            fill: '#000000'
                        },
                        select: {
                            fill: '#f23644'
                        }
                    }
                }
            }
        }
    },

    scrollbar: {
        barBackgroundColor: '#5f5959',
        trackBorderColor: '#5f5959'
    },

    rangeSelector: {
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
                    fill: '#f96772',
                    style: {
                        color: '#000000'
                    }
                },
                hover: {
                    fill: 'none',
                    stroke: '#f96772',
                    'stroke-width': 1,
                    style: {
                        color: '#ffffff'
                    }
                }
            }
        }
    },

    plotOptions: {
        area: {
            threshold: null,
            color: '#f23644',
            fillColor: {
                linearGradient: [0, 0, 0, 450],
                stops: [
                    [0, '#5c0d13'],
                    [1, '#000000']
                ]
            }
        }
    },


    tooltip: {
        backgroundColor: '#212020',
        style: {
            color: '#ffffff'
        }
    }
});

// Configuring the chart.
Highcharts.stockChart('container', {

    title: {
        text: 'BTCETH',
        align: 'left'
    },

    xAxis: {
        tickLength: 0,
        lineWidth: 0,
        crosshair: {
            width: 1,
            color: '#616161',
            zIndex: 3
        }
    },

    scrollbar: {
        barBorderRadius: 4,
        height: 8,
        margin: 0,
        trackBorderRadius: 4
    },

    yAxis: {
        gridLineWidth: 0,
        offset: 30,
        accessibility: {
            description: 'price in Ethereum'
        }
    },

    navigator: {
        enabled: false,
        xAxis: {
            gridLineWidth: 0
        },
        outlineWidth: 0,
        handles: {
            lineWidth: 0
        }
    },

    rangeSelector: {
        buttonPosition: {
            align: 'right'
        },
        buttonSpacing: 10,
        inputEnabled: false,
        selected: 1
    },

    data: {
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@1e5fcf4/samples/data/btc-eth.csv',
        firstRowAsNames: false,
        startRow: 1
    },

    tooltip: {
        shape: 'rect',
        shadow: false,
        borderWidth: 0
    },

    series: [{
        name: 'BTC-ETH Price',
        type: 'area',
        tooltip: {
            valueDecimals: 2,
            pointFormat: '{point.y}'
        }
    }]
});
