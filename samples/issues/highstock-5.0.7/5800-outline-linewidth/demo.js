$(function () {
    $('#container').highcharts('StockChart', {
        navigator: {
            outlineColor: 'blue',
            outlineWidth: 9
        },
        rangeSelector: {
            selected: 2
        },
        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});