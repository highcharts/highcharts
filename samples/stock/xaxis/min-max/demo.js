$(function () {
    $('#container').highcharts('StockChart', {
        title: {
            text: 'yAxis: {min: 0.6, max: 0.9}'
        },
        rangeSelector: {
            selected: 1
        },

        yAxis: {
            min: 0.6,
            max: 0.9,
            startOnTick: false,
            endOnTick: false
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});