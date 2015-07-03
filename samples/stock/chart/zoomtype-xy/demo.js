$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            zoomType: 'xy'
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