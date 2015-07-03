$(function () {
    $('#container').highcharts({

        chart: {
            marginLeft: 120
        },

        title: {
            text: 'Axes offset by 10px'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            offset: 10,
            lineWidth: 2
        },

        yAxis: {
            lineWidth: 2,
            min: 0,
            offset: 10,
            tickWidth: 1
        },

        series: [{
            type: 'spline',
            data: [29.9, 71.5, 0, 0, 0, 450.0, 135.6, 148.5, 216.4, 0, 0, 0]
        }]

    });
});