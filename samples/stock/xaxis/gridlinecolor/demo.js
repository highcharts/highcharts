$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            gridLineColor: 'green'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});