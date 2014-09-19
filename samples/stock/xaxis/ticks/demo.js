$(function () {
    $('#container').highcharts('StockChart', {

        xAxis: {
            tickColor: 'green',
            tickLength: 10,
            tickWidth: 3,
            tickPosition: 'inside'
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