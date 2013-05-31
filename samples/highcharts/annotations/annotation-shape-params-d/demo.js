$(function () {
    $('#container').highcharts({
        title: {
            text: 'Chart title'
        },
        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            xValue: 7,
            yValue: 140,
            anchorY: 'top',
            anchorX: 'middle',
            title: {
                text: 'Holidays',
                y: 60
            },
            shape: {
                type: 'path',
                params: {
                    d: ['M', -25, 10, 'L', 20, 60, 'M', 25, 60, 'L', 40, 0],
                    stroke: '#000000',
                    strokeWidth: 2
                }
            }
        }]

    });
});