$(function () {
    $('#container').highcharts('StockChart', {

        xAxis: {
            labels: {
                staggerLines: 2
            },
            tickPixelInterval: 50
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