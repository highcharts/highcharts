$(function () {
    $('#container').highcharts({
        title: {
            text: 'basic annotations - rectangle'
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
            xValue: 5,
            yValue: 225,
            anchorY: 'top',
            anchorX: 'left',
            // title: {},
            shape: {
                type: 'rect',
                params: {
                    width: 440,
                    height: 120,
                    x: -20,
                    y: 0,
                    stroke: Highcharts.getOptions().colors[1],
                    strokeWidth: 2
                }
            }
        }]

    });
});