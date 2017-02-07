
Highcharts.stockChart('container', {

    title: {
        text: 'Chart title',
        margin: 50
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});