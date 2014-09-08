$(function () {
    $('#container').highcharts('StockChart', {

        navigator: {
            maskFill: 'rgba(180, 198, 220, 0.75)'
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