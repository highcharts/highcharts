
$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        yAxis: [{
            height: '50%',
            title: {
                text: 'AAPL'
            }
        }, {
            opposite: false,
            height: '50%',
            title: {
                text: 'CCI'
            },
            labels: {
                align: 'left',
                x: 3
            },
            resize: {
                enabled: true,
                controlledAxis: {
                    next: ['atr', 'rsi'],
                    prev: [0]
                }
            }
        }, {
            top: '50%',
            height: '50%',
            offset: 0,
            title: {
                text: 'ATR'
            },
            id: 'atr'
        }, {
            opposite: false,
            offset: 0,
            title: {
                text: 'RSI'
            },
            labels: {
                align: 'left',
                x: 3
            },
            top: '50%',
            height: '50%',
            id: 'rsi'
        }],

        series: [{
            type: 'ohlc',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            yAxis: 1,
            type: 'cci',
            linkedTo: 'aapl'
        }, {
            yAxis: 2,
            type: 'atr',
            linkedTo: 'aapl'
        }, {
            yAxis: 3,
            type: 'rsi',
            linkedTo: 'aapl'
        }]
    });
});
