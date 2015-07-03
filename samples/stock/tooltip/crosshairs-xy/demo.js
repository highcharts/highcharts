$(function () {
    $('#container').highcharts('StockChart', {

        tooltip: {
            crosshairs: [true, true]
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