$(function () {
    $('#container').highcharts('StockChart', {

        scrollbar: {
            height: 30
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