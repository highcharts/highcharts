Highcharts.chart('container', {
    title: {
        text: 'Shapes created with axis units'
    },

    series: [{
        data: [188, 57, 245, 12, 176]
    }],

    yAxis: {
        max: 300
    },

    xAxis: {
        min: 0,
        max: 6
    },

    annotations: [{
        shapeOptions: {
            xAxis: 0,
            yAxis: 0
        },
        shapes: [{
            point: {
                x: 1,
                y: 50
            },
            type: 'circle',
            r: 50
        }, {
            point: {
                x: 3,
                y: 150
            },
            type: 'rect',
            width: 1,
            height: 100
        }, {
            points: [{
                x: 1,
                y: 150
            }, {
                x: 2.5,
                y: 150
            }],
            type: 'ellipse',
            ry: 50
        }, {
            type: 'path',
            points: [{
                x: 0,
                y: 300
            }, {
                x: 4,
                y: 180
            }, {
                x: 6,
                y: 195
            }]
        }]
    }]
});
