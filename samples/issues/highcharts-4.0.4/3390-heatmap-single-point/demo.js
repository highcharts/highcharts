$(function () {

    $('#container').highcharts({
        chart: {
            type: 'heatmap'
        },
        title: {
            text: 'Single point heatmap - border and gradient'
        },
        series: [{
            borderWidth: 1,
            borderColor: 'black',
            color: {
                linearGradient: {
                    x1: 0,
                    x2: 1,
                    y1: 0,
                    y2: 0
                },
                stops: [
                    [0, '#FFFFFF'],
                    [1, '#007340']
                ]
            },
            data: [{
                x: 0,
                y: 0,
                value: 90
            }]
        }]

    });
});