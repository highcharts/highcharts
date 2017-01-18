$(function () {
    Highcharts.stockChart('container', {

        navigator: {
            handles: {
                backgroundColor: 'yellow',
                borderColor: 'red'
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
});