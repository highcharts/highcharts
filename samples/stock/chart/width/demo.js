
Highcharts.stockChart('container', {

    chart: {
        width: 800
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});