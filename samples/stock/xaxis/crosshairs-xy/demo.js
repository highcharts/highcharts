
Highcharts.stockChart('container', {

    yAxis: {
        crosshair: true
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});