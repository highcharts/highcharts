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
            data: [29.9, {
                id: 'point1',
                y: 71.5
            }, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            linkedTo: 'point1',
            anchorX: 'left',
            title: {
                text: 'Point annotations',
                x: 30,
                y: -5,
            },
            shape: {
                type: 'path',
                params: {
                    d: ['M', 10, 8, 'L', 25, 8],
                    stroke: '#000000',
                    strokeWidth: 2
                }
            }
        }]

    });
});