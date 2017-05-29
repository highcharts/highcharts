
Highcharts.stockChart('container', {

    title: {
        text: 'This is the chart title'
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});