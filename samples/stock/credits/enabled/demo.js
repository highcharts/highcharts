$(function () {
    $('#container').highcharts('StockChart', {

        credits: {
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