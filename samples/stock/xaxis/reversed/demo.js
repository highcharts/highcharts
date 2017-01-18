$(function () {
    Highcharts.stockChart('container', {

        yAxis: {
            reversed: true,
            showFirstLabel: false,
            showLastLabel: true
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