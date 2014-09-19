$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            borderWidth: 2,
            marginBottom: 100
        },

        navigator: {
            top: 260
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