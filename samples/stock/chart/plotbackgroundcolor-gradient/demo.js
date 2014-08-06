$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            plotBackgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 1
                },
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(200, 200, 255)']
                ]
            }
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