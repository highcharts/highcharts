
Highcharts.stockChart('container', {

    yAxis: {
        minorTickInterval: 'auto'
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});