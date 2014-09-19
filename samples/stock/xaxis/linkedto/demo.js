$(function () {
    $('#container').highcharts('StockChart', {

        title: {
            text: 'Linked Y axis on left side'
        },

        yAxis: [{}, {
            linkedTo: 0,
            opposite: false
        }],

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});