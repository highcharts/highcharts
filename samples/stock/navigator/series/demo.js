$(function () {
    Highcharts.stockChart('container', {

        navigator: {
            series: {
                color: '#FF00FF',
                lineWidth: 2
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