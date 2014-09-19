$(function () {
    $('#container').highcharts('StockChart', {

        navigator: {
            height: 80
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