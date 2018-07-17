
QUnit.test('Accessibility disabled', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                enabled: false
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0];

    assert.notOk(
        point.graphic.element.getAttribute('aria-label'),
        'There be no ARIA on point'
    );

    assert.notOk(chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'), 'There be no screen reader region');
});

QUnit.test('No data', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        series: [{}]
    });
    assert.ok(
        chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'),
        'There be screen reader region, empty series'
    );

    chart = Highcharts.chart('container', {});
    assert.ok(
        chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'),
        'There be screen reader region, no series option'
    );

    chart = Highcharts.chart('container', {
        series: []
    });
    assert.ok(
        chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'),
        'There be screen reader region, no series items'
    );
});

QUnit.test('pointDescriptionThreshold', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                pointDescriptionThreshold: 7
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0];

    assert.ok(
        point.graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );

    point.series.addPoint(4);

    assert.notOk(
        point.series.points[6].graphic.element.getAttribute('aria-label'),
        'There be no ARIA on point'
    );
});

QUnit.test('seriesDescriptionFormatter', function (assert) {
    var chart = Highcharts.chart('container', {
        accessibility: {
            seriesDescriptionFormatter: function (series) {
                return 'yo ' + series.name;
            },
            describeSingleSeries: true
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6],
            name: 'First'
        }, {
            data: [1, 2, 3, 4, 5, 6],
            name: 'Second with <em>markup</em>'
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.element.parentNode
            .getAttribute('aria-label'),
        'yo First',
        'Custom aria-label on series'
    );
    assert.strictEqual(
        chart.series[1].points[0].graphic.element.parentNode
            .getAttribute('aria-label'),
        'yo Second with markup',
        'Custom aria-label, markup stripped away'
    );
});

QUnit.test('pointDescriptionFormatter', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                pointDescriptionFormatter: function (point) {
                    return 'yo' + point.index;
                }
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0];

    assert.strictEqual(point.graphic.element.getAttribute('aria-label'), 'yo0', 'Custom aria-label on point');
});

QUnit.test('Chart description', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            description: 'Description: Yo.'
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6]
        }]
    });

    assert.ok(chart.screenReaderRegion.innerHTML.indexOf('Description: Yo.') > -1, 'Chart description included in screen reader region');
});
