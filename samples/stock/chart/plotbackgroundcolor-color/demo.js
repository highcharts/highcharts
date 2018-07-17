
Highcharts.stockChart('container', {

    chart: {
        plotBackgroundColor: '#FCFFC5'
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});