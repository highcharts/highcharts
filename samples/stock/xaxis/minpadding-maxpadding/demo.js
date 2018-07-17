
Highcharts.stockChart('container', {

    yAxis: {
        minPadding: 0.5,
        maxPadding: 0.5
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});