
$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        yAxis: [{
            height: '75%',
            resize: {
                enabled: true
            },
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'AAPL'
            }
        }, {
            top: '75%',
            height: '25%',
            labels: {
                align: 'right',
                x: -3
            },
            offset: 0,
            title: {
                text: 'MACD'
            }
        }],

        title: {
            text: 'AAPL Stock Price'
        },

        subtitle: {
            text: 'With MACD and Pivot Points technical indicators'
        },

        series: [{
            type: 'ohlc',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data,
            zIndex: 1
        }, {
            type: 'pivotpoints',
            linkedTo: 'aapl',
            zIndex: 0,
            lineWidth: 1,
            dataLabels: {
                overflow: 'none',
                crop: false,
                y: 4,
                style: {
                    fontSize: 9
                }
            }
        }, {
            type: 'macd',
            yAxis: 1,
            linkedTo: 'aapl'
        }]
    });
});
