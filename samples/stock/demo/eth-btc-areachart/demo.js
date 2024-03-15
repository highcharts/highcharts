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
        text: 'ETHBTC',
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
        max: 0.07,
        min: 0.045,
        offset: 30,
        labels: {
            style: {
                color: '#b0abab'
            }
        },
        accessibility: {
            description: 'price in Bitcoin'
        }
    },

    navigator: {
        enabled: false
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
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@a1bd9d5/samples/data/eth-btc.csv',
        parsed: columns => {
            const removeIndices = [1, 2, 3, 5, 6];
            for (let i = removeIndices.length - 1; i >= 0; i--) {
                columns.splice(removeIndices[i], 1);
            }
        }
    },

    tooltip: {
        borderWidth: 0
    },

    series: [{
        type: 'area',
        color: '#f23644',
        tooltip: {
            valueDecimals: 4,
            valuePrefix: '₿',
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
