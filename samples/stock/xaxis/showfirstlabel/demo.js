$(function () {
    $('#container').highcharts('StockChart', {
        title: {
            text: 'yAxis: {showFirstLabel: false}'
        },

        yAxis: {
            showFirstLabel: false,
            showLastLabel: true,
            labels: {
                y: 12
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