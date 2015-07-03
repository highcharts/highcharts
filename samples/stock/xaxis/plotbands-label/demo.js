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
                color: 'yellow',
                label: {
                    text: 'Comfort zone',
                    align: 'center',
                    verticalAlign: 'top',
                    y: 12
                }
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