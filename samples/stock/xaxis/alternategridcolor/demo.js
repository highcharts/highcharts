$(function () {
    Highcharts.stockChart('container', {

        yAxis: {
            alternateGridColor: '#FDFFD5'
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