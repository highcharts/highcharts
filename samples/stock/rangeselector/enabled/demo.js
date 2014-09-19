$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            enabled: false
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});