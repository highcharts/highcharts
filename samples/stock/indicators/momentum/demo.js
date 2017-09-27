
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
            type: 'momentum',
            linkedTo: 'aapl',
            name: 'Momentum (14)'
        }, {
            type: 'momentum',
            linkedTo: 'aapl',
            name: 'Momentum (50)',
            params: {
                period: 50
            }
        }]
    });
});
