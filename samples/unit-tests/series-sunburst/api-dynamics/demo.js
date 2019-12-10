QUnit.test('Chart.addSeries.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        });
    chart.addSeries({
        type: 'sunburst',
        data: [1]
    });
    assert.strictEqual(
        chart.series.length,
        2,
        'chart.series.length should equal 2 after addSeries'
    );
});

QUnit.test('Chart.setSize.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        });
    chart.setSize(200, 200);
    // TODO find something to tests against.
    // This only tests wether setSize is executed without errors
    assert.strictEqual(
        'todo',
        'todo',
        'todo'
    );
});

QUnit.test('Point.remove.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0],
        point = series.points[0];
    point.remove();
    assert.strictEqual(
        series.points.length,
        2,
        'series.points.length should equal 1 after removing point.'
    );
});

QUnit.test('Point.select.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0],
        point = series.points[0];
    assert.strictEqual(
        !!point.selected,
        false,
        'point.selected should equal false before select().'
    );
    point.select();
    assert.strictEqual(
        point.selected,
        true,
        'point.selected should equal true after select().'
    );
    assert.strictEqual(
        point.state,
        'select',
        'point.state should equal "selected" after select().'
    );
});

QUnit.test('Point.update.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0],
        point = series.points[0];
    point.update(5);
    assert.strictEqual(
        point.value,
        5,
        'point.value should equal 5 after updating point.'
    );
    assert.strictEqual(
        series.points.length,
        3,
        'series.points.length should still equal 3 after updating point.'
    );
});

QUnit.test('Series.addPoint.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0];
    series.addPoint(4);
    assert.strictEqual(
        series.points.length,
        4,
        'series.points.length should equal 4 after addPoint'
    );
});

QUnit.test('Series.hide.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0];
    assert.strictEqual(
        series.visible,
        true,
        'series.visible should equal true before hide.'
    );
    series.hide();
    assert.strictEqual(
        series.visible,
        false,
        'series.visible should equal false after hide.'
    );
});

QUnit.test('Series.remove.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0];
    series.remove();
    assert.strictEqual(
        chart.series.length,
        0,
        'chart.series.length should equal 0 after Series.remove'
    );
});

QUnit.test('Series.removePoint.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0],
        result;
    series.removePoint(0);
    assert.strictEqual(
        series.points.length,
        2,
        'series.points.length should equal 3 after addPoint'
    );
    result = !H.find(series.points, function (p) {
        return p.value === 1;
    });
    assert.strictEqual(
        result,
        true,
        'should not exist any points with value equal 1.'
    );
});

QUnit.test('Series.select.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0];
    assert.strictEqual(
        !!series.selected,
        false,
        'series.selected should equal false before select().'
    );
    series.select();
    assert.strictEqual(
        !!series.selected,
        true,
        'series.selected should equal true after select().'
    );
    // TODO series.state is not working as expected
    // assert.strictEqual(
    //     series.state,
    //     'select',
    //     'series.state should equal "select" after select().'
    // );
});

QUnit.test('Series.setData.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0];
    series.setData([1, 2, 3, 4]);
    assert.strictEqual(
        series.points.length,
        4,
        'series.points.length should equal 4 after setData.'
    );
});

QUnit.test('Series.setVisible.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0];
    assert.strictEqual(
        series.visible,
        true,
        'series.visible should equal true by default.'
    );
    series.setVisible(false);
    assert.strictEqual(
        series.visible,
        false,
        'series.visible should equal false.'
    );
    series.setVisible(true);
    assert.strictEqual(
        series.visible,
        true,
        'series.visible should equal true.'
    );
});

QUnit.test('Series.show.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3],
                visible: false
            }]
        }),
        series = chart.series[0];
    assert.strictEqual(
        series.visible,
        false,
        'series.visible should equal false before show.'
    );
    series.show();
    assert.strictEqual(
        series.visible,
        true,
        'series.visible should equal true after show.'
    );
});

QUnit.test('Series.update.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'sunburst',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0],
        controller = new TestController(chart);
    assert.strictEqual(
        series.color,
        '#7cb5ec',
        'series.color should equal #7cb5ec before update.'
    );
    series.update({
        color: '#ff0000'
    });
    assert.strictEqual(
        series.color,
        '#ff0000',
        'series.color should equal #ff0000 after update.'
    );

    series.update({
        dataLabels: {
            enabled: false
        },
        allowDrillToNode: true,
        data: [{
            id: '0.0',
            parent: ''
        }, {
            id: '1.1',
            parent: '0.0'
        }, {
            id: '1.2',
            parent: '0.0'
        }, {
            parent: '1.1',
            value: 3
        }, {
            parent: '1.1',
            value: 2
        }, {
            parent: '1.1',
            value: 1
        }, {
            parent: '1.2',
            value: 3
        }, {
            parent: '1.2',
            value: 2
        }, {
            parent: '1.2',
            value: 1
        }]
    });

    controller.mouseOver(
        series.center[0] - series.center[2] / 4 + chart.plotLeft,
        series.center[1] + chart.plotTop
    );

    controller.click(
        series.center[0] - series.center[2] / 4 + chart.plotLeft,
        series.center[1] + chart.plotTop
    );

    assert.strictEqual(
        chart.series[0].rootNode,
        '1.2',
        'Drilldown should work after series.update (#12425).'
    );
});
