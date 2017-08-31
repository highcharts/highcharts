QUnit.test('Chart.addSeries.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }]
            }]
        });
    chart.addSeries({
        type: 'wordcloud',
        data: [{
            name: 'One',
            weight: 1
        }, {
            name: 'Two',
            weight: 2
        }]
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
            }]
        }),
        series = chart.series[0],
        point = series.points[0];
    point.remove();
    assert.strictEqual(
        series.points.length,
        2,
        'series.points.length should equal 2 after removing point.'
    );
});

QUnit.test('Point.select.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
            }]
        }),
        series = chart.series[0],
        point = series.points[0];
    point.update(5);
    assert.strictEqual(
        point.weight,
        5,
        'point.weight should equal 5 after updating point.'
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
            }]
        }),
        series = chart.series[0],
        result;
    // TODO how should addPoint behave in Word Cloud?
    series.addPoint(4);
    assert.strictEqual(
        series.points.length,
        4,
        'series.points.length should equal 4 after addPoint'
    );
    result = !!H.find(series.points, function (p) {
        return p.weight === 4;
    });
    assert.strictEqual(
        result,
        true,
        'A point with weight of 4 has been added.'
    );
});

QUnit.test('Series.hide.', function (assert) {
    var H = Highcharts,
        chart = H.chart('container', {
            series: [{
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
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
        return p.weight === 1;
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
            }]
        }),
        series = chart.series[0];
    series.setData([{
        name: 'One',
        weight: 1
    }, {
        name: 'Two',
        weight: 2
    }, {
        name: 'Three',
        weight: 3
    }, {
        name: 'Four',
        weight: 4
    }]);
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }],
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
                type: 'wordcloud',
                data: [{
                    name: 'One',
                    weight: 1
                }, {
                    name: 'Two',
                    weight: 2
                }, {
                    name: 'Three',
                    weight: 3
                }]
            }]
        }),
        series = chart.series[0];
    assert.strictEqual(
        series.options.custom,
        undefined,
        'series.options.custom should equal undefined before update.'
    );
    series.update({
        custom: true
    });
    assert.strictEqual(
        series.options.custom,
        true,
        'series.options.custom should equal true after update.'
    );
});
