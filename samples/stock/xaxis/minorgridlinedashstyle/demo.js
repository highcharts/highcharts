$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            minorGridLineColor: '#F0F0F0',
            minorGridLineDashStyle: 'longdash',
            minorTickInterval: 'auto'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});