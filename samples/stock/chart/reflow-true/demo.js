
Highcharts.stockChart('container', {

    chart: {
        // reflow: true // by default
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});