Highcharts.stockChart('container', {

    chart: {
        panning: {
            enabled: true,
            type: 'y'
        },
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