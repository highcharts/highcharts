$(function () {
    Highcharts.chart('container', {
        chart: {
            polar: true,
            type: 'spline'
        },
        series: [{
            type: 'areaspline',
            data: [2, 2, 2, 2]
        }, {
            data: [3, 3, 3, 3]
        }, {
            type: 'areasplinerange',
            data: [
                [2, 3],
                [2, 3],
                [2, 3],
                [2, 3]
            ]
        }]
    });
});