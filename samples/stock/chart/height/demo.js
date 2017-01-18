$(function () {
    Highcharts.stockChart('container', {

        chart: {
            height: 300
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