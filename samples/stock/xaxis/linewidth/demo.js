$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        xAxis: {
            lineWidth: 2
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});