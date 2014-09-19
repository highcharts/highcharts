$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            width: 800
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