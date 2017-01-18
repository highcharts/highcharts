$(function () {
    Highcharts.stockChart('container', {

        chart: {
            borderWidth: 2,
            marginTop: 100
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