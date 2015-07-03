$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            backgroundColor: '#FFFFFF',
            shadow: true
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