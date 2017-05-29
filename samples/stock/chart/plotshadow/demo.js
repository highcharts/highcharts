
Highcharts.stockChart('container', {

    chart: {
        plotBackgroundColor: '#ECF1F6',
        plotShadow: true
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});