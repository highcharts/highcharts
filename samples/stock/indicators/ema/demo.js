
$.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlc.json&callback=?', function (data) {

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

        series: [{
            type: 'ohlc',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            type: 'ema',
            name: 'EMA (14)',
            linkedTo: 'aapl'
        }, {
            type: 'ema',
            name: 'EMA (50)',
            linkedTo: 'aapl',
            params: {
                period: 50
            }
        }]
    });
});
