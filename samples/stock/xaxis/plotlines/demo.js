$(function () {
    $('#container').highcharts('StockChart', {

        yAxis: {
            plotLines: [{
                value: 0.696,
                width: 1,
                color: 'green',
                dashStyle: 'dash',
                label: {
                    text: 'Latest value',
                    align: 'right',
                    y: 12,
                    x: 0
                }
            }]
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