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
});