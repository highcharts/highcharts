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
            xValue: 2,
            yValue: 50,
            anchorX: 'center',
            anchorY: 'top',
            units: 'values',
            shape: {
                type: 'rect',
                params: {
                    x: -2,
                    y: -50,
                    width: 1,
                    height: 50,
                    stroke: '#000000',
                    strokeWidth: 2
                }
            }
        }]

    });
});