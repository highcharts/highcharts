$(function () {
    var chart = Highcharts.chart('container', {
        chart: {
            parallelCoordinates: true,
            parallelAxes: {
                tickAmount: 2
            },
            inverted: true
        },
        yAxis: [{
            reversed: true
        }, {
            reversed: false
        }, {
            type: 'category'
        }, {
            type: 'datetime'
        }, {
            type: 'logarithmic'
        }],
        series: [{
            data: [1, 2, 3, 1, 10000, 3, 1, 2, 3, 1000]
        }, {
            data: [5, 10, 12, 3, 0.5, 5, -20, 1000, 9, 10]
        }]
    });
});