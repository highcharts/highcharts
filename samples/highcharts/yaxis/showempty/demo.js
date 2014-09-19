$(function () {
    $('#container').highcharts({

        title: {
            text: 'Y axis showEmpty demo'
        },

        subtitle: {
            text: 'Left axis shows even if Series 1 is hidden. Right axis does not show when Series 2 is hidden.'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: [{
            lineWidth: 2
            // showEmpty: true // by default
        }, {
            lineWidth: 2,
            opposite: true,
            showEmpty: false
        }],

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            yAxis: 0
        }, {
            data: [106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5],
            yAxis: 1,
            visible: false
        }]
    });
});