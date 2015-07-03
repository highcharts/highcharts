$(function () {
    $('#container').highcharts({

        title: {
            text: 'Tooltip snap',
            align: 'left'
        },

        subtitle: {
            text: 'The stickyTracking option is false. Tooltip should display when hovering 50 pixels from the graphs',
            align: 'left'
        },

        tooltip: {
            snap: 50
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                stickyTracking: false
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4]
        }]
    });
});