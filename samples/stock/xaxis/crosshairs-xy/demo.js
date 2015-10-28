$(function () {
    $('#container').highcharts('StockChart', {

        yAxis: {
            crosshair: true
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