
Highcharts.stockChart('container', {

    chart: {
        type: 'area'
    },

    rangeSelector: {
        selected: 1
    },

    plotOptions: {
        series: {
            gapSize: 1
        }
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});