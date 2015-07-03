$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            borderColor: '#EBBA95',
            borderWidth: 2,
            borderRadius: 10
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