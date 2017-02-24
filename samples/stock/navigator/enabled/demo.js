
Highcharts.stockChart('container', {

    navigator: {
        enabled: false
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});