$(function () {
    $('#container').highcharts('StockChart', {

        navigator: {
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