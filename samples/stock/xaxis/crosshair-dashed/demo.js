
Highcharts.stockChart('container', {

    xAxis: {
        crosshair: {
            dashStyle: 'dash'
        }
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});