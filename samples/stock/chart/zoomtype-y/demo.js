
Highcharts.stockChart('container', {

    chart: {
        zoomType: 'y'
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});