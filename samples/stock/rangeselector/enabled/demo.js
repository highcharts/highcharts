
Highcharts.stockChart('container', {

    rangeSelector: {
        enabled: false
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});