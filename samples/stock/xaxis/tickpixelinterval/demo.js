$(function () {
    $('#container').highcharts('StockChart', {

        xAxis: {
            tickPixelInterval: 200
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