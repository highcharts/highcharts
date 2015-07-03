$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            zoomType: 'x'
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