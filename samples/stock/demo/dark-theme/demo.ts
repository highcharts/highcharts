(async () => {
    const data = await fetch(
        'https://www.highcharts.com/samples/data/new-intraday.json'
    ).then(response => response.json());

    // Define a custom symbol path
    Highcharts.SVGRenderer.prototype.symbols.oval = (
        x: number, y: number, w: number, h: number
    ) => {
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
        palette: {
            colorScheme: 'dark',
            dark: {
                backgroundColor: '#202d3b',
                neutralColor: '#e6e8ea',
                highlightColor: '#0190b7'
            }
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
        navigator: {
            handles: {
                symbols: ['oval', 'oval'],
                width: 8,
                height: 24,
                backgroundColor: 'var(--highcharts-highlight-color-100)',
                lineWidth: 0
            },
            maskInside: false,
            maskFill: '#eeeeee44',
            xAxis: {
                gridLineWidth: 0,
                labels: {
                    style: {
                        opacity: 1,
                        textOutline: 'none'
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
                padding: 1,
                r: 2
            },
            inputStyle: {
                color: 'var(--highcharts-neutral-color-80)'
            },
            labelStyle: {
                color: 'var(--highcharts-neutral-color-80)'
            }
        },
        tooltip: {
            backgroundColor: '#fbfbfb',
            borderRadius: 0,
            borderWidth: 0,
            padding: 3,
            style: {
                color: '#000'
            }
        },
        xAxis: {
            gridLineColor: 'var(--highcharts-neutral-color-3)',
            gridLineWidth: 1,
            lineColor: 'var(--highcharts-neutral-color-60)',
            tickColor: 'var(--highcharts-neutral-color-60)',
            tickLength: 5
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
            gridLineColor: 'var(--highcharts-neutral-color-3)',
            lineColor: 'var(--highcharts-neutral-color-60)',
            lineWidth: 1,
            labels: {
                align: 'left'
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