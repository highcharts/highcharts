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
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0]
        }],
        annotations: [{
            shapes: [{
                point: {
                    x: 3,
                    y: 150,
                    xAxis: 0,
                    yAxis: 0
                },
                type: 'rect',
                width: 1,
                height: 100,
                xAxis: 0,
                yAxis: 0
            }, {
                point: {
                    x: 1,
                    y: 50,
                    xAxis: 0,
                    yAxis: 0
                },
                type: 'circle',
                r: 1,
                xAxis: 0
            }]
        }]
    });

    const xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        rect = chart.annotations[0].shapes[0],
        circle = chart.annotations[0].shapes[1],
        // Draw from x=3 to x=4
        rectWidth = Math.abs(xAxis.toPixels(4) - xAxis.toPixels(3)),
        // Draw from y=150 to y=250
        rectHeight = Math.abs(yAxis.toPixels(250) - yAxis.toPixels(150)),
        // Draw from x=2 to x=4
        circleRadius = Math.abs(xAxis.toPixels(4) - xAxis.toPixels(2)) / 2;

    assert.close(
        rectWidth,
        Number(rect.graphic.element.getAttribute('width')),
        0.01,
        'Rect annotation created with axis units width is correct.'
    );
    assert.close(
        rectHeight,
        Number(rect.graphic.element.getAttribute('height')),
        0.01,
        'Rect annotation created with axis units height is correct.'
    );
    assert.close(
        circleRadius,
        Number(circle.graphic.element.getAttribute('r')),
        0.01,
        'Circle annotation created with axis units radius is correct.'
    );
});
