$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            backgroundColor: '#FCFFC5'
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