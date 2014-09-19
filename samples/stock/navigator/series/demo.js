$(function () {
    $('#container').highcharts('StockChart', {

        navigator: {
            series: {
                color: 'green'
            }
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