$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            gridLineWidth: 2
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});