$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        plotOptions: {
            line: {
                gapSize: 2
            }
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});