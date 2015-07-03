$(function () {
    $('#container').highcharts('StockChart', {

        tooltip: {
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, 'white'],
                    [1, '#EEE']
                ]
            },
            borderColor: 'gray',
            borderWidth: 1
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