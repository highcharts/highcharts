$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            height: 300
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