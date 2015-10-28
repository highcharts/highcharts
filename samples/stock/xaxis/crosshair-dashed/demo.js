$(function () {
    $('#container').highcharts('StockChart', {

        xAxis: {
            crosshair: {
                dashStyle: 'dash'
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