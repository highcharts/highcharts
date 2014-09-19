$(function () {
    $('#container').highcharts('StockChart', {

        yAxis: {
            lineWidth: 2,
            offset: 70,
            labels: {
                align: 'right',
                x: -3,
                y: 6
            },
            showLastLabel: true
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