$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        xAxis: {
            lineColor: 'red'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});