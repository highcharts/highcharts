
Highcharts.stockChart('container', {

    title: {
        text: 'The title'
    },

    subtitle: {
        text: 'The subtitle',
        style: {
            color: '#FF00FF',
            fontWeight: 'bold'
        }
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});