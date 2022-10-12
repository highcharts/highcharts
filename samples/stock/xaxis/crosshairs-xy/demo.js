Highcharts.stockChart('container', {

    yAxis: {
        crosshair: {
            enabled: true,
            label: {
                enabled: true
            }
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