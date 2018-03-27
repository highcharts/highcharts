
$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        plotOptions: {
            macd: {
                zones: [{
                    value: 0,
                    color: 'green'
                }, {
                    color: 'red'
                }]
            }
        },

        yAxis: [{
            height: '25%'
        }, {
            top: '25%',
            height: '25%'
        }, {
            top: '50%',
            height: '25%'
        }, {
            top: '70%',
            height: '25%'
        }],

        series: [{
            type: 'ohlc',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            // Two different zones:
            type: 'macd',
            yAxis: 1,
            linkedTo: 'aapl',
            macdLine: {
                zones: [{
                    value: -1,
                    color: 'blue'
                }, {
                    value: 1,
                    color: 'grey'
                }, {
                    color: 'black'
                }]
            },
            signalLine: {
                zones: [{
                    value: -1.5,
                    color: 'blue'
                }, {
                    color: 'orange'
                }]
            }
        }, {
            // Only one zone, for signal:
            type: 'macd',
            yAxis: 2,
            linkedTo: 'aapl',
            signalLine: {
                styles: {
                    lineWidth: 2,
                    lineColor: 'black'
                },
                zones: [{
                    value: -1.5,
                    color: 'blue'
                }, {
                    color: 'orange'
                }]
            }
        }, {
            // Only zones for histogram
            color: '#dedede',
            type: 'macd',
            yAxis: 3,
            linkedTo: 'aapl'
        }]
    });
});
