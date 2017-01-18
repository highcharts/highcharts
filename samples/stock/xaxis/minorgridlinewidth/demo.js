$(function () {
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            minorGridLineColor: '#F0F0F0',
            minorGridLineWidth: 2,
            minorTickInterval: 'auto'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});