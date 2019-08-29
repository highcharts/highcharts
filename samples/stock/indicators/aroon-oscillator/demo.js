Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        legend: {
            enabled: true
        },

        yAxis: [{
            height: '48%'
        }, {
            height: '40%',
            top: '60%',
            min: -100,
            max: 101
        }],

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            type: 'aroonoscillator',
            linkedTo: 'aapl',
            yAxis: 1,
            color: 'turquoise',
            lineWidth: 1.5,
            style: {
                lineWidth: 5
            },
            params: {
                period: 14
            }
        }]
    });
});
