$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            type: 'logarithmic',
            minorTickInterval: 'auto'
        },

        series: [{
            data: [2, 5, 3, 7, 40, 3]
        }]

    });
});