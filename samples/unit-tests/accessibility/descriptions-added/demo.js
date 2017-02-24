
// Tests that ARIA attribs and screen reader information section have been added
QUnit.test('Basic accessible chart', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0];

    assert.ok(
        point.graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );

    assert.ok(chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'), 'There be screen reader region');
});

QUnit.test('Accessible chart with multiple series', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }, {
                data: [4, 2, 3, 1, 5, 2]
            }]
        }),
        point = chart.series[0].points[0];

    assert.ok(
        point.graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );

    assert.ok(
        point.graphic.element.parentNode.getAttribute('aria-label'),
        'There be ARIA on series'
    );
});

QUnit.test('Empty chart', function (assert) {
    var chart = Highcharts.chart('container', {});
    assert.ok(chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'), 'There be screen reader region');
});

// Pie charts are treated somewhat differently, so do a separate test for these
QUnit.test('Accessible pie', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'pie',
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0];

    assert.ok(
        point.graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );

    assert.ok(chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'), 'There be screen reader region');
});
