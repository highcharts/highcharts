$(function () {
    $('#container').highcharts('StockChart', {

        scrollbar: {
            enabled: false
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