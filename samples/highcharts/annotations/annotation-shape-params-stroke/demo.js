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
            xValue: 6.5,
            yValue: 200,
            anchorY: 'top',
            anchorX: 'center',
            units: 'values',
            shape: {
                type: 'rect',
                params: {
                    width: 2,
                    height: 100,
                    stroke: '#ff0000',
                    strokeWidth: 2
                }
            }
        }]

    });
});