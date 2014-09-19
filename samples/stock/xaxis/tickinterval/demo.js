$(function () {
    $('#container').highcharts('StockChart', {
        title: {
            text: 'yAxis: {tickInterval: 0.01},'
        },
        yAxis: {
            tickInterval: 0.01
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