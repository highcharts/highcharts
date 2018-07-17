
Highcharts.stockChart('container', {

    chart: {
        backgroundColor: '#FFFFFF',
        shadow: true
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});