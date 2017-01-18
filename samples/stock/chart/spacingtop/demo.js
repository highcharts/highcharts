$(function () {
    Highcharts.stockChart('container', {

        chart: {
            borderWidth: 1,
            plotBorderWidth: 1,
            spacingTop: 100
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