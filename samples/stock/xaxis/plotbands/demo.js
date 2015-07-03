$(function () {
    $('#container').highcharts('StockChart', {

        yAxis: {
            min: 0.6,
            max: 0.9,
            startOnTick: false,
            endOnTick: false,
            plotBands: [{
                from: 0.7,
                to: 0.8,
                color: 'yellow'
            }]
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