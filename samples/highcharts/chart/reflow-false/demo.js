$(function () {
    $('#container').highcharts({
        chart: {
            reflow: false
        },
        title: {
            text: 'Chart reflow is set to false'
        },

        subtitle: {
            text: 'When resizing the window or the frame, the chart should not resize'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});