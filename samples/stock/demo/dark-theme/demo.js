(async () => {
    const data = await fetch(
        'https://www.highcharts.com/samples/data/new-intraday.json'
    ).then(response => response.json());

    Highcharts.setOptions({
        chart: {
            backgroundColor: '#202d3b'
        },
        navigator: {
            xAxis: {
                labels: {
                    style: {
                        color: '#c5c7c9',
                        opacity: 1,
                        textOutline: 0
                    }
                }
            },
            series: {
                lineColor: '#FFF'
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
            buttonTheme: {
                r: 0,
                padding: 1
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
                title: 'Set timeframe to 1 minute',
                type: 'hour',
                count: 1,
                dataGrouping: {
                    units: [
                        ['minute', [1]]
                    ]
                }
            }, {
                text: '5m',
                title: 'Set timeframe to 5 minutes',
                type: 'hour',
                count: 6,
                dataGrouping: {
                    units: [
                        ['minute', [5]]
                    ]
                }
            }, {
                text: '15m',
                title: 'Set timeframe to 15 minutes',
                type: 'day',
                count: 1,
                dataGrouping: {
                    units: [
                        ['minute', [15]]
                    ]
                }
            }, {
                text: '30m',
                title: 'Set timeframe to 30 minutes',
                type: 'day',
                count: 3,
                dataGrouping: {
                    units: [
                        ['minute', [30]]
                    ]
                }
            }, {
                text: '1h',
                title: 'Set timeframe to 1 hour',
                dataGrouping: {
                    units: [
                        ['hour', [1]]
                    ]
                }
            }, {
                text: '4h',
                title: 'Set timeframe to 4 hours',
                dataGrouping: {
                    units: [
                        ['hour', [4]]
                    ]
                }
            }, {
                text: 'D',
                title: 'Set timeframe to 1 day',
                dataGrouping: {
                    units: [
                        ['day', [1]]
                    ]
                }
            }],
            selected: 4
        },
        tooltip: {
            pointFormat: ''
        },
        series: [{
            name: 'AAPL',
            data: data,
            type: 'candlestick'
        }]
    });
})();