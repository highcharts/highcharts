$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            plotBorderWidth: 1
        },

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});