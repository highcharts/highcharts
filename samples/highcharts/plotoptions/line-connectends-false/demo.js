$(function () {
    $('#container').highcharts({
        chart: {
            polar: true
        },
        title: {
            text: 'The line doesn\'t connect'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            min: 0
        },

        series: [{
            data: [129.9, 111.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 175.6, 154.4],
            connectEnds: false
        }]
    });
});