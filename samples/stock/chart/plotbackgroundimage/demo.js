
Highcharts.stockChart('container', {

    chart: {
        plotBackgroundImage: 'https://www.highcharts.com/samples/graphics/skies.jpg'
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur,
        color: '#202040'
    }]
});