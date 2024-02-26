(async () => {
    const data = await fetch(
        'https://www.highcharts.com/samples/data/new-intraday.json'
    ).then(response => response.json());

    // Define a custom symbol path
    Highcharts.SVGRenderer.prototype.symbols.oval = function (x, y, w, h) {
        const r = w / 2;

        return [
            'M', x, y,
            'A', r, r, 0, 1, 1, x + w, y,
            'L', x + w, y + h,
            'A', r, r, 0, 1, 1, x, y + h,
            'L', x, y,
            'Z'
        ];
    };

    Highcharts.setOptions({
        chart: {
            backgroundColor: '#202d3b'
        },
        accessibility: {
            typeDescription: 'Combination chart with 2 data series.'
        },
        lang: {
            accessibility: {
                defaultChartTitle: 'Dark themed Highcharts Stock demo'
            },
            rangeSelectorZoom: 'Timeframe'
        },
        navigation: {
            buttonOptions: {
                theme: {
                    fill: '#333333',
                    'stroke-width': 0
                }
            }
        },
        navigator: {
            handles: {
                symbols: ['oval', 'oval'],
                width: 8,
                height: 24,
                backgroundColor: '#0190b7',
                lineWidth: 0
            },
            maskInside: false,
            maskFill: '#eeeeee44',
            xAxis: {
                gridLineWidth: 0,
                labels: {
                    style: {
                        color: '#c5c7c9',
                        opacity: 1,
                        textOutline: 0
                    }
                }
            },
            series: {
                type: 'candlestick',
                dataGrouping: {
                    approximation: 'ohlc',
                    units: [
                        ['minute', [30]]
                    ]
                }
            }
        },
        plotOptions: {
            candlestick: {
                color: '#b82d0d',
                upColor: '#8cc076',
                lineColor: '#ccc'
            },
            series: {
                lastPrice: {
                    color: '#c0c0c0',
                    enabled: true,
                    label: {
                        backgroundColor: '#fbfbfb',
                        borderRadius: 0,
                        enabled: true,
                        padding: 3,
                        style: {
                            color: '#000'
                        }
                    }
                }
            }
        },
        rangeSelector: {
            dropdown: 'always',
            buttonTheme: {
                fill: '#333333',
                padding: 1,
                r: 2,
                states: {
                    hover: {
                        style: {
                            color: '#333333'
                        }
                    }
                },
                style: {
                    color: '#c5c7c9'
                }
            },
            inputStyle: {
                color: '#c5c7c9'
            },
            labelStyle: {
                color: '#c5c7c9'
            }
        },
        tooltip: {
            backgroundColor: '#fbfbfb',
            borderRadius: 0,
            borderWidth: 0,
            padding: 3
        },
        xAxis: {
            gridLineColor: '#21323f',
            gridLineWidth: 1,
            lineColor: '#999999',
            tickColor: '#999999',
            tickLength: 5,
            labels: {
                style: {
                    color: '#c5c7c9'
                }
            }
        },
        yAxis: {
            crosshair: {
                label: {
                    backgroundColor: '#fbfbfb',
                    borderRadius: 0,
                    enabled: true,
                    padding: 3,
                    style: {
                        color: '#000'
                    }
                }
            },
            gridLineColor: '#21323f',
            lineColor: '#999999',
            lineWidth: 1,
            labels: {
                align: 'left',
                style: {
                    color: '#c5c7c9'
                }
            }
        }
    });

    Highcharts.stockChart('container', {
        rangeSelector: {
            buttons: [{
                text: '1m',
                title: '1 Minute',
                type: 'hour',
                count: 1,
                dataGrouping: {
                    units: [
                        ['minute', [1]]
                    ]
                }
            }, {
                text: '5m',
                title: '5 Minutes',
                type: 'hour',
                count: 6,
                dataGrouping: {
                    units: [
                        ['minute', [5]]
                    ]
                }
            }, {
                text: '15m',
                title: '15 Minutes',
                type: 'day',
                count: 1,
                dataGrouping: {
                    units: [
                        ['minute', [15]]
                    ]
                }
            }, {
                text: '30m',
                title: '30 Minutes',
                type: 'day',
                count: 3,
                dataGrouping: {
                    units: [
                        ['minute', [30]]
                    ]
                }
            }, {
                text: '1h',
                title: '1 Hour',
                dataGrouping: {
                    units: [
                        ['hour', [1]]
                    ]
                }
            }, {
                text: '4h',
                title: '4 Hours',
                dataGrouping: {
                    units: [
                        ['hour', [4]]
                    ]
                }
            }, {
                text: 'D',
                title: '1 Day',
                dataGrouping: {
                    units: [
                        ['day', [1]]
                    ]
                }
            }],
            selected: 1
        },
        scrollbar: {
            enabled: false
        },
        tooltip: {
            pointFormat: ''
        },
        yAxis: {
            title: {
                text: 'Price',
                reserveSpace: false,
                style: {
                    visibility: 'hidden'
                }
            }
        },
        series: [{
            name: 'AAPL',
            data: data,
            type: 'candlestick'
        }]
    });
})();