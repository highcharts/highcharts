// 1
QUnit.test('Drawing path based on points', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400
        },

        series: [
            {
                keys: ['y', 'id'],
                dataLabels: { enabled: true, x: 0, y: 0 },
                data: [
                    [29.9, '0'],
                    [71.5, '1'],
                    [106.4, '2'],
                    [129.2, '3'],
                    [144.0, '4'],
                    [176.0, '5']
                ]
            }
        ],

        yAxis: {
            max: 300
        },

        annotations: [
            {
                shapes: [
                    {
                        borderWidth: 1,
                        backgroundColor: 'none',
                        type: 'path',
                        points: [
                            '1',
                            {
                                x: 2,
                                y: 200,
                                xAxis: 0,
                                yAxis: 0
                            },
                            '2',
                            {
                                x: 3,
                                y: 200,
                                xAxis: 0,
                                yAxis: 0
                            }
                        ]
                    }
                ]
            }
        ]
    });

    var roundPath = dArray => {
            dArray.map(value => {
                var number = Math.round(value);
                return Highcharts.isNumber(number) ? number : value;
            });
        },
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        data = chart.series[0].data,
        shape = chart.annotations[0].shapes[0].graphic;

    var actualPath = shape.d.split(' ');
    var expectedPath = [
        'M',
        xAxis.toPixels(data[1].x),
        yAxis.toPixels(data[1].y),
        'L',
        xAxis.toPixels(2),
        yAxis.toPixels(200),
        'L',
        xAxis.toPixels(data[2].x),
        yAxis.toPixels(data[2].y),
        'L',
        xAxis.toPixels(3),
        yAxis.toPixels(200)
    ];

    assert.deepEqual(
        roundPath(actualPath),
        roundPath(expectedPath),
        'Compare path d attribute'
    );
});

// 2
QUnit.test('Drawing shapes on incorrect points', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400
        },

        series: [
            {
                keys: ['y', 'id'],
                dataLabels: { enabled: true, x: 0, y: 0 },
                data: [
                    [29.9, '0'],
                    [71.5, '1'],
                    [106.4, '2'],
                    [129.2, '3'],
                    [144.0, '4'],
                    [176.0, '5']
                ]
            }
        ],

        yAxis: {
            max: 300
        },

        annotations: [
            {
                shapes: [
                    {
                        type: 'path',
                        points: [{ x: 20, y: 20 }, null, '1']
                    },
                    {
                        type: 'rect'
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.annotations[0].shapes.length,
        0,
        'Shape is destroyed if the points are incorrect'
    );
});

// 3
QUnit.test('Drawing path with a marker', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400
        },

        defs: {
            marker0: {
                attributes: {
                    style: 'display: none'
                },
                id: 'arrow-marker',
                tagName: 'marker',
                refY: 5,
                refX: 5,
                markerWidth: 10,
                markerHeight: 10,
                children: [
                    {
                        tagName: 'path',
                        d:
                            'M 0 0 L 10 5 L 0 10 Z' // triangle (used as an
                            // arrow)
                    }
                ]
            }
        },

        series: [
            {
                keys: ['y', 'id'],
                dataLabels: { enabled: true, x: 0, y: 0 },
                data: [
                    [29.9, '0'],
                    [71.5, '1'],
                    [106.4, '2'],
                    [129.2, '3'],
                    [144.0, '4'],
                    [176.0, '5']
                ]
            }
        ],

        yAxis: {
            max: 300
        },

        annotations: [
            {
                shapes: [
                    {
                        type: 'path',
                        points: [{ x: 200, y: 100 }, '2'],
                        markerEnd: 'arrow-marker',
                        markerStart: 'arrow-marker',
                        id: 'shape'
                    }
                ]
            }
        ]
    });

    assert.notOk(
        document.getElementById('arrow-marker'),
        'The base marker should not be created with render = false'
    );

    var marker = document.getElementById('shape-arrow-marker');
    assert.ok(marker, 'Marker is created');
    assert.strictEqual(
        marker.parentNode.nodeName,
        'defs',
        'Marker is placed in defs tag'
    );

    var path = marker.querySelector('path');
    assert.ok(path, 'Marker path is created inside the marker');
    assert.strictEqual(
        path.getAttribute('d'),
        'M 0 0 L 10 5 L 0 10 Z',
        'Marker path d attribute is correct'
    );

    var shape = chart.annotations[0].shapes[0];
    assert.strictEqual(
        shape.graphic.element.getAttribute(
            'marker-end'
        ).replace(/"/g, ''), // Edge inserts double quotes
        'url(#' + shape.markerEnd.id + ')',
        'End marker id is correctly attached to the annotation\'s path'
    );
    assert.strictEqual(
        shape.graphic.element.getAttribute(
            'marker-start'
        ).replace(/"/g, ''), // Edge inserts double quotes,
        'url(#' + shape.markerStart.id + ')',
        'Start marker is correctly attached to the annotation\'s path'
    );
});

// 4
QUnit.test('Basic shape annotations', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400
        },
        series: [{
            keys: ['y', 'id'],
            data: [
                [29.9, '0'],
                [71.5, '1'],
                [106.4, '2'],
                [129.2, '3'],
                [144.0, '4'],
                [176.0, '5']
            ]
        }],
        annotations: [{
            shapes: [{
                point: {
                    x: 3,
                    y: 150
                },
                type: 'rect',
                fill: '#f00000',
                width: 1,
                height: 100,
                xAxis: 0,
                yAxis: 0
            }, {
                point: {
                    x: 1,
                    y: 50
                },
                type: 'circle',
                fill: '#00f000',
                r: 50,
                xAxis: 0,
                yAxis: 0
            }, {
                points: [{
                    x: 1,
                    y: 150
                }, {
                    x: 3,
                    y: 150
                }],
                type: 'ellipse',
                fill: '#0000f0',
                ry: 50,
                xAxis: 0,
                yAxis: 0
            }]
        }]
    });

    const xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        shapes = chart.annotations[0].shapes,
        // Draw from x=3 to x=4
        rectWidth = Math.abs(xAxis.toPixels(4) - xAxis.toPixels(3)),
        // Draw from y=150 to y=250
        rectHeight = Math.abs(yAxis.toPixels(250) - yAxis.toPixels(150)),
        // Draw from y=0 to y=100, radius = 50 yAxis units
        circleRadius = Math.abs(yAxis.toPixels(100) - yAxis.toPixels(0)) / 2,
        // Draw from y=150 to y=250, radiusY = 50 yAxis units
        ellipseRadiusY =
            Math.abs(yAxis.toPixels(250) - yAxis.toPixels(150)) / 2;

    // Annotations dimensions
    assert.close(
        rectWidth,
        Number(shapes[0].graphic.element.getAttribute('width')),
        0.01,
        'Rect annotation created with axis units width is correct.'
    );
    assert.close(
        rectHeight,
        Number(shapes[0].graphic.element.getAttribute('height')),
        0.01,
        'Rect annotation created with axis units height is correct.'
    );
    assert.close(
        circleRadius,
        Number(shapes[1].graphic.element.getAttribute('r')),
        0.01,
        'Circle annotation created with axis units radius is correct.'
    );
    assert.close(
        ellipseRadiusY,
        Number(shapes[2].graphic.element.getAttribute('ry')),
        0.01,
        'Ellipse annotation created with axis units radius is correct.'
    );

    // Annotations positions
    assert.close(
        shapes[0].graphic.element.getAttribute('x'),
        xAxis.toPixels(3),
        0.01,
        'Rect annotation created with xAxis units position is correct.'
    );
    assert.close(
        shapes[0].graphic.element.getAttribute('y'),
        yAxis.toPixels(150),
        0.01,
        'Rect annotation created with yAxis units position is correct.'
    );
    assert.close(
        shapes[1].graphic.element.getAttribute('cx'),
        xAxis.toPixels(1),
        0.01,
        'Circle annotation created with xAxis units position is correct.'
    );
    assert.close(
        shapes[1].graphic.element.getAttribute('cy'),
        yAxis.toPixels(50),
        0.01,
        'Circle annotation created with yAxis units position is correct.'
    );
    assert.close(
        shapes[2].graphic.element.getAttribute('cx'),
        xAxis.toPixels(2),
        0.01,
        'Ellipse annotation created with xAxis units position is correct.'
    );
    assert.close(
        shapes[2].graphic.element.getAttribute('cy'),
        yAxis.toPixels(150),
        0.01,
        'Ellipse annotation created with yAxis units position is correct.'
    );

    // Add annotation with point as series key
    chart.addAnnotation({
        shapes: [{
            points: '4',
            type: 'circle',
            r: 20,
            xAxis: 0,
            yAxis: 0
        }]
    });

    assert.ok(
        true,
        'Adding annotation with point as series key should not throw an error.'
    );
});

// #22356 - End marker (arrow) color should follow `stroke` when the user
// did not explicitly set `fill`, so that the arrow head and the line have
// matching colors.
QUnit.test('Arrow marker color follows stroke (#22356)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400
        },
        series: [{
            data: [1, 2, 3, 4, 5]
        }],
        annotations: [{
            shapes: [{
                type: 'path',
                points: [
                    { x: 0, y: 1, xAxis: 0, yAxis: 0 },
                    { x: 4, y: 5, xAxis: 0, yAxis: 0 }
                ],
                markerEnd: 'arrow',
                stroke: '#ff0000',
                strokeWidth: 2
            }, {
                type: 'path',
                points: [
                    { x: 0, y: 5, xAxis: 0, yAxis: 0 },
                    { x: 4, y: 1, xAxis: 0, yAxis: 0 }
                ],
                markerEnd: 'arrow',
                stroke: '#00aa00',
                fill: '#0000ff',
                strokeWidth: 2
            }]
        }]
    });

    var shapeStrokeOnly = chart.annotations[0].shapes[0],
        markerStrokeOnly = document.getElementById(
            shapeStrokeOnly.markerEnd.id
        ),
        markerPathStrokeOnly = markerStrokeOnly &&
            markerStrokeOnly.querySelector('path');

    assert.ok(
        markerPathStrokeOnly,
        'Marker path element should exist for stroke-only shape.'
    );
    assert.strictEqual(
        markerPathStrokeOnly.getAttribute('fill'),
        '#ff0000',
        'Arrow head fill should follow `stroke` when user did not set `fill`.'
    );
    assert.strictEqual(
        markerPathStrokeOnly.getAttribute('stroke'),
        '#ff0000',
        'Arrow head stroke should follow `stroke` when user did not set `fill`.'
    );

    var shapeWithFill = chart.annotations[0].shapes[1],
        markerWithFill = document.getElementById(
            shapeWithFill.markerEnd.id
        ),
        markerPathWithFill = markerWithFill &&
            markerWithFill.querySelector('path');

    assert.strictEqual(
        markerPathWithFill.getAttribute('fill'),
        '#0000ff',
        'Arrow head should still honor explicitly user-set `fill`.'
    );
});
