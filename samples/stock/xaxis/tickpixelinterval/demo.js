
Highcharts.stockChart('container', {

    xAxis: {
        tickPixelInterval: 200
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});