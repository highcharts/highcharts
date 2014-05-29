$(function () {
    $('#container').highcharts({
        title: {
            text: 'Expect the Y axis being rounded down, due to startOnTick is true (default).'
        },
        subtitle: {
            text: 'yAxis.min = -50'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            min: -50
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});