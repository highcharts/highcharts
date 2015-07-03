$(function () {
    $('#container').highcharts('StockChart', {

        title: {
            text: 'Y axis is not opposite, renders on the left'
        },

        yAxis: {
            opposite: false
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