QUnit.test('Flowmap API options.', assert => {
    const chart = Highcharts.mapChart('container', {
        mapView: {
            zoom: 3,
            center: [10, 50]
        },
        series: [{
            type: 'mappoint',
            data: [{
                id: 'A',
                lat: 50,
                lon: 0
            }, {
                id: 'B',
                lon: 20,
                lat: 50
            }, {
                id: 'C',
                lon: 30,
                lat: 40
            }]
        }, {
            type: 'flowmap',
            linkedTo: ':previous',
            data: [{
                from: 'A',
                to: 'B',
                weight: 1
            }]
        }]
    });

    const series = chart.series[1];

    // Test curveFactor

    assert.strictEqual(
        series.points[0].shapeArgs.d[0][2],
        series.points[0].shapeArgs.d[1][2],
        `Based on 2 points with the same lat, the arrow should be
        horizontal (no curve).`
    );

    series.points[0].update({
        curveFactor: 1
    });

    assert.notStrictEqual(
        series.points[0].shapeArgs.d[0][2],
        series.points[0].shapeArgs.d[1][2],
        `Based on 2 points with the same lat, the arrow should no longer be
        horizontal (curved).`
    );

    series.points[0].update({
        curveFactor: void 0
    }, false);

    series.addPoint({
        from: 'B',
        to: 'C',
        weight: 1
    });

    assert.notStrictEqual(
        series.points[0].shapeArgs.d[0][2],
        series.points[0].shapeArgs.d[1][2],
        `When curveFactor is not specified there should be calculated an
        automated curve based on center of mass of all flowmap points (curved).`
    );

    assert.notStrictEqual(
        series.points[1].shapeArgs.d[0][2],
        series.points[1].shapeArgs.d[1][2],
        `When curveFactor is not specified there should be calculated an
        automated curve based on center of mass of all flowmap points (curved).`
    );

    // Test weight

    series.points[1].update({
        weight: void 0
    });

    series.update({
        width: void 0
    });

    assert.strictEqual(
        series.points[1].shapeArgs.d.length,
        0,
        `The point without a width or weight defined on a point or series level
        should not be drawn.`
    );

    series.points[1].update({
        weight: 1
    });

    assert.strictEqual(
        series.points[1].shapeArgs.d.length,
        8,
        'The point with a weight defined on a point level should be drawn.'
    );

    assert.notOk(
        series.points[1].isNull,
        `The point with a weight defined on a point level should not be
        null.`
    );

    series.points[1].update({
        weight: null
    });

    assert.strictEqual(
        series.points[1].shapeArgs.d.length,
        0,
        `The point without a weight defined on a point or series level
        should not be drawn.`
    );

    series.update({
        weight: 1
    });

    assert.strictEqual(
        series.points[1].shapeArgs.d.length,
        8,
        'The point with a weight defined on a series level should be drawn.'
    );

    // Test markerEnd

    assert.strictEqual(
        series.points[1].shapeArgs.d.length,
        8,
        'MarkerEnd should be enabled by default (path length is 7).'
    );

    let arrowWidth = 5;

    series.points[0].update({
        curveFactor: 0, // make arrow straight to simplify y comparison
        markerEnd: {
            width: arrowWidth
        }
    });

    assert.strictEqual(
        series.points[0].shapeArgs.d[1][2],
        series.points[0].shapeArgs.d[2][2] - arrowWidth,
        `The markerEnd arrow width should be ${arrowWidth}.`
    );

    const previousArrowWidth = arrowWidth,
        previousArrowVertexY = series.points[0].shapeArgs.d[2][2];

    arrowWidth = 20;

    series.points[0].update({
        markerEnd: {
            width: arrowWidth
        }
    });

    assert.strictEqual(
        series.points[0].shapeArgs.d[1][2],
        series.points[0].shapeArgs.d[2][2] - arrowWidth,
        `The markerEnd arrow width should be ${arrowWidth}.`
    );

    assert.strictEqual(
        series.points[0].shapeArgs.d[2][2],
        previousArrowVertexY + arrowWidth - previousArrowWidth,
        `The markerEnd arrow width should increase by
        ${arrowWidth - previousArrowWidth}.`
    );

    // Test style attribs

    // Series options

    assert.strictEqual(
        series.points[1].graphic.attr('fill'),
        chart.options.colors[series.index],
        'The point with a weight defined on a series level should be drawn.'
    );

    assert.strictEqual(
        series.points[1].graphic.attr('fill-opacity'),
        series.options.fillOpacity,
        'The points graphic should have a correct fill-opacity.'
    );

    assert.strictEqual(
        series.group.attr('opacity'),
        1,
        'The series group should have opacity 1 by default.'
    );

    assert.strictEqual(
        series.points[1].graphic.attr('opacity'),
        1,
        'The points graphic should have opacity 1 by default.'
    );

    series.update({
        fillColor: '#0000ff',
        fillOpacity: 0.6,
        opacity: 0.7,
        markerEnd: {
            enabled: false
        }
    });

    assert.strictEqual(
        series.points[1].graphic.attr('fill'),
        series.options.fillColor,
        'The points fill from series options should be correct.'
    );

    assert.strictEqual(
        series.points[1].graphic.attr('fill-opacity'),
        series.options.fillOpacity,
        'The points fill-opacity from series options should be correct.'
    );

    assert.strictEqual(
        series.group.attr('opacity'),
        series.options.opacity,
        'The series group opacity should be correct.'
    );

    assert.strictEqual(
        series.points[1].shapeArgs.d.length,
        5,
        'MarkerEnd should be disabled (shapes path length should be 5).'
    );

    // Point options

    assert.notStrictEqual(
        series.points[1].color,
        series.options.nullColor,
        'The not-null point should have a correct color in options.'
    );

    assert.strictEqual(
        series.points[1].graphic.attr('stroke'),
        series.points[1].color,
        'The points stroke color should be correct.'
    );

    series.points[1].update({
        color: '#000000', // stroke
        fillColor: '#ff0000',
        fillOpacity: 0.6,
        opacity: 0.7
    });

    assert.strictEqual(
        series.points[1].graphic.attr('stroke'),
        series.points[1].color,
        `After update, the point's stroke color (from point options)
        should be correct.`
    );

    assert.strictEqual(
        series.points[1].graphic.attr('fill'),
        series.points[1].options.fillColor,
        `After update, the point's fill from point options should be
        correct.`
    );

    assert.strictEqual(
        series.points[1].graphic.attr('fill-opacity'),
        series.points[1].options.fillOpacity,
        `After update, the point's fill-opacity from point options should
        be correct.`
    );

    assert.strictEqual(
        series.points[1].graphic.attr('opacity'),
        series.points[1].options.opacity,
        `After update, the point's opacity from point options should be
        correct.`
    );

    // End of style attribs tests

    const pointToRemove = series.points[1];

    pointToRemove.remove();

    assert.notOk(
        pointToRemove.graphics,
        'After point.remove(), the point graphic should be destroyed.'
    );

    assert.strictEqual(
        series.points.length,
        1,
        'After point.remove(), there should be only one point left.'
    );

    chart.series[1].remove();

    assert.strictEqual(
        chart.series.length,
        1,
        'After series.remove(), there should be only two series.'
    );

    chart.addSeries({
        type: 'flowmap',
        linkedTo: ':previous',
        weight: 1,
        data: [{
            from: 'A',
            to: 'B'
        }, {
            from: 'B',
            to: 'C'
        }]
    });

    assert.ok(
        chart.series[1].points[1].graphic,
        'After adding the flowmap series, the flowmap point should exist.'
    );

    chart.series[1].addPoint({
        from: {
            lat: 45,
            lon: 25
        },
        to: [20, 40]
    });

    assert.ok(
        chart.series[1].points[2].graphic,
        `Flowmap point should have possibility to use lonLatArray in from and to
        properties.`
    );

    assert.notOk(
        chart.series[1].points[2].isNull,
        'Points with correctly defined data should not be null.'
    );
});
