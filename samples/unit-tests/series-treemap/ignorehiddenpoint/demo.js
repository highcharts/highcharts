QUnit.test('ignoreHiddenPoint: undefined. Defaults to true.', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: "treemap",
                data: [{
                    name: 'A',
                    value: 1
                }, {
                    name: 'B',
                    value: 1
                }]
            }]
        }),
        point = chart.series[0].points[0];
    assert.strictEqual(
        !!point.graphic.element,
        true,
        'Point visible. Point graphic should be drawn.'
    );
    point.setVisible(false);
    assert.strictEqual(
        !!point.graphic,
        false,
        'Point hidden. Point graphic should be destroyed.'
    );
    point.setVisible(true);
    assert.strictEqual(
        !!point.graphic.element,
        true,
		'Point visible. Point graphic should be drawn.'
    );
});

QUnit.test('ignoreHiddenPoint: false.', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: "treemap",
                ignoreHiddenPoint: false,
                data: [{
                    name: 'A',
                    value: 1
                }, {
                    name: 'B',
                    value: 1
                }]
            }]
        }),
        point = chart.series[0].points[0];
    assert.strictEqual(
        !!point.graphic.element,
        true,
		'Point visible. Point graphic should be drawn.'
    );
    point.setVisible(false);
    assert.strictEqual(
        !!point.graphic.element,
        true,
		'Point hidden. Point graphic should still be drawn.'
    );
    point.setVisible(true);
    assert.strictEqual(
        !!point.graphic.element,
        true,
		'Point visible. Point graphic should be drawn.'
    );
});

QUnit.test('ignoreHiddenPoint: true.', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: "treemap",
                ignoreHiddenPoint: true,
                data: [{
                    name: 'A',
                    value: 1
                }, {
                    name: 'B',
                    value: 1
                }]
            }]
        }),
        point = chart.series[0].points[0];
    assert.strictEqual(
        !!point.graphic.element,
        true,
		'Point visible. Point graphic should be drawn.'
    );
    point.setVisible(false);
    assert.strictEqual(
        !!point.graphic,
        false,
		'Point hidden. Point graphic should be destroyed.'
    );
    point.setVisible(true);
    assert.strictEqual(
        !!point.graphic.element,
        true,
		'Point visible. Point graphic should be drawn.'
    );
});