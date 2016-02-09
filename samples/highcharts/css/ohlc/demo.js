$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        series: [{
            type: 'ohlc',
            name: 'USD to EUR',
            data: ohlcdata
        }]
    });
});