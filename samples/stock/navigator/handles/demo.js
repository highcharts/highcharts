$(function () {
    $('#container').highcharts('StockChart', {

        navigator: {
            handles: {
                backgroundColor: 'yellow',
                borderColor: 'red'
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