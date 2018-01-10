
Highcharts.stockChart('container', {
    title: {
        text: 'xAxis: {min: Date.UTC(2010, 8, 1), max: Date.UTC(2014, 8, 1)}'
    },

    xAxis: {
        min: Date.UTC(2010, 8, 1),
        max: Date.UTC(2014, 8, 1)
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});