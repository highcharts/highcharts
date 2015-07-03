$(function () {
    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            type: 'logarithmic',
            minorTickInterval: 0.1
        },

        series: [{
            data: [0.29, 71.5, 1.06, 1292, 14.4, 1.760, 135, 1.48, 0.216, 0.194, 9.56, 54.4]
        }]
    });
});