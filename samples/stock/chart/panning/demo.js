Highcharts.stockChart('container', {

    chart: {
        panning: 'xy',
        panKey: 'alt',
        zoomType: 'xy'
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});