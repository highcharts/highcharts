QUnit.test('Mock Point translations from x/y in the options to plotX/plotY', function (assert) {
    var H = Highcharts,
        MockPoint = H.MockPoint,
        chart = H.chart('container', {
            xAxis: [{
                min: 0,
                max: 10
            }, {
                min: -1,
                max: 2
            }],

            series: [{
                data: [[5, 1]]
            }, {
                xAxis: 1,
                data: [[0, 1]]
            }, {
                data: [
                    [-20, 5],
                    [2, 5], {
                        x: 5,
                        y: 2,
                        marker: {
                            enabled: false
                        }
                    }, {
                        x: 110,
                        y: 4,
                        marker: {
                            enabled: false
                        }
                    },
                    [112, 4]
                ],
                marker: {
                    enabled: true
                }
            }]
        }),

        xAxis0 = chart.xAxis[0],
        xAxis1 = chart.xAxis[1],
        yAxis = chart.yAxis[0],

        point,
        options;

    /* Point 1 */
    options = {
        xAxis: 0,
        yAxis: 0,
        x: 5,
        y: 5
    };
    point = new MockPoint(chart, options);
    point.translate();

    assert.strictEqual(
        Math.round(point.plotX),
        Math.round(xAxis0.toPixels(options.x, true)),
        'plotX translation from the first xAxis'
    );

    assert.strictEqual(
        Math.round(point.plotY),
        Math.round(yAxis.toPixels(options.y, true)),
        'plotY translation from the first yAxis'
    );

    /* Point 2 */
    options = {
        xAxis: 1,
        x: 1,
        y: 0
    };
    point = new MockPoint(chart, options);
    point.translate();

    assert.strictEqual(
        Math.round(point.plotX),
        Math.round(xAxis1.toPixels(options.x, true)),
        'plotX translation from the second xAxis'
    );

    assert.strictEqual(
        point.plotY,
        options.y,
        'plotY translation from pixels'
    );

    /* Point 3 */
    options = {
        x: 0,
        y: 200
    };
    point = new MockPoint(chart, options);
    point.translate();

    assert.strictEqual(
        Math.round(point.plotX),
        Math.round(options.x),
        'plotX translation from pixels'
    );


    var isInsidePane = Highcharts.MockPoint.prototype.isInsidePane;
    var points = chart.series[2].points;

    assert.notOk(
        isInsidePane.call(points[0]),
        'The real point is outside the pane area'
    );

    assert.ok(
        isInsidePane.call(points[1]),
        'The real point is inside the pane area'
    );

    assert.ok(
        isInsidePane.call(points[2]),
        'The real point without marker is inside the pane area'
    );

    assert.notOk(
        isInsidePane.call(points[3]),
        'The real point without marker is outside the pane area'
    );

    chart.xAxis[0].setExtremes(109, 113);

    assert.notOk(
        isInsidePane.call(points[0]),
        'After set extremes - the real point is outside the pane area'
    );

    assert.notOk(
        isInsidePane.call(points[1]),
        'After set extremes - the real point is outside the pane area'
    );

    assert.notOk(
        isInsidePane.call(points[2]),
        'After set extremes - the real point without marker is outside the pane area'
    );

    assert.ok(
        isInsidePane.call(points[3]),
        'After set extreems - the real point without marker is inside the pane area'
    );

    assert.ok(
        isInsidePane.call(points[4]),
        'After set extreems - the real point is inside the pane area'
    );
});
