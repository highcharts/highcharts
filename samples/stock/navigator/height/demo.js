
Highcharts.stockChart('container', {

    navigator: {
        height: 80
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});