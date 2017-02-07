
Highcharts.stockChart('container', {

    title: {
        text: 'The title'
    },

    subtitle: {
        text: 'The subtitle'
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});