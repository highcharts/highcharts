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
            height: '55%'
        }, {
            height: '40%',
            top: '60%'
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
            type: 'apo',
            linkedTo: 'aapl',
            yAxis: 1,
            color: 'grey',
            lineWidth: 2,
            params: {
                periods: [10, 20]
            }
        }]

    });
});
