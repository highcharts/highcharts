$(function () {
    $('#container').highcharts({
        chart: {
            type: 'spline'
        },

        legend: {
            symbolWidth: 80
        },

        plotOptions: {
            series: {
                color: '#000000'
            }
        },

        series: [{
            data: [1, 3, 2, 4, 5, 4, 6, 2, 3, 5, 6],
            dashStyle: 'longdash'
        }, {
            data: [2, 4, 1, 3, 4, 2, 9, 1, 2, 3, 4, 5],
            dashStyle: 'shortdot'
        }]
    });
});