$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            plotBorderColor: '#346691',
            plotBorderWidth: 2
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