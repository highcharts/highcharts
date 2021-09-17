// Tests that ARIA attribs and screen reader information section have been added
QUnit.test('Basic accessible chart', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        point = chart.series[0].points[0];

    assert.ok(
        point.graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );

    assert.ok(
        chart.accessibility.components.infoRegions.screenReaderSections.before
            .element.getAttribute(
                'aria-label'
            ),
        'There be screen reader region'
    );
});

QUnit.test('Accessible chart with multiple series', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                },
                {
                    data: [4, 2, 3, 1, 5, 2]
                }
            ]
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
    assert.ok(
        chart.accessibility.components.infoRegions.screenReaderSections.before
            .element.getAttribute(
                'aria-label'
            ),
        'There be screen reader region'
    );
});

// Pie charts are treated somewhat differently, so do a separate test for these
QUnit.test('Accessible pie', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'pie',
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        point = chart.series[0].points[0];

    assert.ok(
        point.graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );

    assert.ok(
        chart.accessibility.components.infoRegions.screenReaderSections.before
            .element.getAttribute(
                'aria-label'
            ),
        'There be screen reader region'
    );
});

QUnit.test('No information region', function (assert) {
    var chart = Highcharts.chart('container', {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: ''
            }
        },
        series: [{ data: [1, 2, 3] }]
    });

    assert.notOk(
        chart.accessibility.components.infoRegions
            .screenReaderSections.before.element,
        'There is no before screen reader region'
    );
    assert.ok(
        chart.accessibility.components.infoRegions
            .screenReaderSections.after.element,
        'There is an after screen reader region'
    );

    chart.update({
        accessibility: {
            screenReaderSection: {
                afterChartFormat: ''
            }
        }
    });

    assert.notOk(
        chart.accessibility.components.infoRegions
            .screenReaderSections.after.element,
        'There is no after screen reader region after update'
    );
});
