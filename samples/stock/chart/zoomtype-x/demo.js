
Highcharts.stockChart('container', {

    chart: {
        zoomType: 'x'
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});