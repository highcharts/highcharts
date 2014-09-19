$(function () {
    $('#container').highcharts('StockChart', {

        title: {
            text: 'This is the chart title'
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