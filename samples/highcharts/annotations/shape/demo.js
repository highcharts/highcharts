Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    title: {
        text: 'Basic shape annotations'
    },

    series: [{
        keys: ['y', 'id'],
        data: [
            [29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'], [144.0, '4'],
            [176.0, '5']
        ]
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
            // Convert all points and sizes of shapes to axis units
            xAxis: 0,
            yAxis: 0
        },
        shapes: [{
            type: 'circle',
            // Use series key as point
            point: '0',
            r: 10
        }, {
            type: 'rect',
            // Use axis units as rect coordinates
            point: {
                x: 3,
                y: 150
            },
            width: 0.5,
            height: 50
        }, {
            type: 'path',
            points: ['0', '3', {
                x: 6,
                y: 195
            }],
            fill: 'none',
            stroke: 'red',
            strokeWidth: 3,
            markerEnd: 'arrow'
        }, {
            type: 'ellipse',
            points: [{
                x: 1,
                y: 200
            }, {
                x: 3,
                y: 200
            }],
            ry: 50
        }],
        labels: [{
            point: {
                x: 6,
                y: 195,
                xAxis: 0,
                yAxis: 0
            }
        }]
    }]
});
