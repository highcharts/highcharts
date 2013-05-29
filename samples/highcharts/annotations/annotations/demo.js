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
                y: 71.5,
                id: 'a'
            }, 106.4, {
                y: 129.2,
                id: 'b'
            }, 144.0, {
                y: 176.0,
                id: 'c'
            }, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            linkedTo: 'a',
            anchorX: 'center',
            anchorY: 'top',
            width: 10,
            title: {
                text: 'A',
                x: -2,
                y: 15
            },
            shape: {
                type: 'path',
                params: {
                    d: ['M', 5, 0, 'L', 5, 20],
                    strokeWidth: 1,
                    stroke: '#000000'
                }
            }
        }, {
            linkedTo: 'b',
            anchorX: 'center',
            anchorY: 'top',
            width: 10,
            title: {
                text: 'B',
                x: -2,
                y: 15
            },
            shape: {
                type: 'path',
                params: {
                    d: ['M', 5, 0, 'L', 5, 20],
                    strokeWidth: 1,
                    stroke: '#000000'
                }
            }
        }, {
            linkedTo: 'c',
            anchorX: 'center',
            anchorY: 'top',
            width: 10,
            title: {
                text: 'C',
                x: -2,
                y: 15
            },
            shape: {
                type: 'path',
                params: {
                    d: ['M', 5, 0, 'L', 5, 20],
                    strokeWidth: 1,
                    stroke: '#000000'
                }
            }
        }]

    });
});