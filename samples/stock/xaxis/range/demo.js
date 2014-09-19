$(function () {
    $('#container').highcharts('StockChart', {

        xAxis: {
            range: 6 * 30 * 24 * 3600 * 1000 // six months
        },

        rangeSelector: {
            enabled: false
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});