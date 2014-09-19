$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            gridLineDashStyle: 'longdash'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});