
Highcharts.stockChart('container', {

    chart: {
        borderWidth: 2,
        marginLeft: 150
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});