$(function () {
    $('#container').highcharts('StockChart', {

        xAxis: {
            minRange: 30 * 24 * 3600 * 1000
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