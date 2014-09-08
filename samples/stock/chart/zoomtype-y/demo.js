$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            zoomType: 'y'
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