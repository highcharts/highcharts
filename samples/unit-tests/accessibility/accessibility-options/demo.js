function getScreenReaderSectionEl(chart) {
    var a11y = chart.accessibility,
        components = a11y && a11y.components,
        infoRegions = components && components.infoRegions;
    return infoRegions && infoRegions.screenReaderSections.before.element;
}

function getPointAriaLabel(point) {
    return point.graphic.element.getAttribute('aria-label');
}

function getSeriesAriaLabel(series) {
    return series.markerGroup.element.getAttribute('aria-label');
}

function isPointAriaHidden(point) {
    return point.graphic.element.getAttribute('aria-hidden') === 'true';
}


QUnit.test('Accessibility disabled', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                enabled: false
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0],
        srSection = getScreenReaderSectionEl(chart);

    assert.notOk(getPointAriaLabel(point), 'There be no ARIA on point');

    assert.notOk(
        srSection && srSection.getAttribute('aria-label'),
        'There be no screen reader region'
    );
});

QUnit.test('Keyboard nav disabled', function (assert) {
    const chart = Highcharts.chart('container', {
        accessibility: {
            keyboardNavigation: {
                enabled: false
            }
        },
        series: [{
            data: [1]
        }]
    });

    assert.notOk(chart.container.getAttribute('tabindex'), 'There is no tabindex on container');
});

QUnit.test('No data', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{}]
    });

    assert.ok(
        getScreenReaderSectionEl(chart).getAttribute('aria-label'),
        'There be screen reader region, empty series'
    );

    chart = Highcharts.chart('container', {});
    assert.ok(
        getScreenReaderSectionEl(chart).getAttribute('aria-label'),
        'There be screen reader region, no series option'
    );

    chart = Highcharts.chart('container', {
        series: []
    });
    assert.ok(
        getScreenReaderSectionEl(chart).getAttribute('aria-label'),
        'There be screen reader region, no series items'
    );
});

QUnit.test('pointDescriptionEnabledThreshold', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                series: {
                    pointDescriptionEnabledThreshold: 7,
                    describeSingleSeries: true
                }
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        series = chart.series[0];

    assert.ok(getPointAriaLabel(series.points[0]), 'There be ARIA on point');
    assert.ok(getSeriesAriaLabel(series), 'There be ARIA on series');

    series.addPoint(4);

    assert.notOk(getPointAriaLabel(series.points[6]), 'There be no ARIA on point');
    assert.ok(getSeriesAriaLabel(series), 'There be ARIA on series');
});

QUnit.test('pointNavigationThreshold', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                keyboardNavigation: {
                    seriesNavigation: {
                        pointNavigationEnabledThreshold: 7
                    }
                }
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0];

    assert.ok(getPointAriaLabel(point), 'There be ARIA on point');
    assert.strictEqual(
        point.graphic.element.getAttribute('tabindex'),
        '-1',
        'There be tabindex on point'
    );
    assert.strictEqual(
        getSeriesAriaLabel(chart.series[0]),
        '',
        'There be empty ARIA on series'
    );

    point.series.addPoint(4);

    assert.ok(
        getPointAriaLabel(point.series.points[6]),
        'There still be ARIA on point'
    );
    assert.strictEqual(
        getSeriesAriaLabel(chart.series[0]),
        '',
        'There still be ARIA on series'
    );
});

QUnit.test('seriesDescriptionFormatter', function (assert) {
    var chart = Highcharts.chart('container', {
        accessibility: {
            series: {
                descriptionFormatter: function (series) {
                    return 'yo ' + series.name;
                },
                describeSingleSeries: true
            }
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
        getSeriesAriaLabel(chart.series[0]),
        'yo First',
        'Custom aria-label on series'
    );
    assert.strictEqual(
        getSeriesAriaLabel(chart.series[1]),
        'yo Second with markup',
        'Custom aria-label, markup stripped away'
    );
});

QUnit.test('pointDescriptionFormatter', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        return 'yo' + point.index;
                    }
                }
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0];

    assert.strictEqual(getPointAriaLabel(point), 'yo0', 'Custom aria-label on point');
});

QUnit.test('Chart description', function (assert) {
    var chart = Highcharts.chart('container', {
        accessibility: {
            description: 'Description: Yo.'
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6]
        }]
    });
    assert.ok(
        getScreenReaderSectionEl(chart).innerHTML.indexOf('Description: Yo.') > -1,
        'Chart description included in screen reader region'
    );
});

QUnit.test('Landmark verbosity', function (assert) {
    var numRegions = function (chart) {
            return (
                chart.renderTo.outerHTML.match(/role="region"/g) || []
            ).length;
        },
        chart = Highcharts.chart('container', {
            accessibility: {
                landmarkVerbosity: 'disabled'
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        });
    assert.strictEqual(numRegions(chart), 0, 'No landmarks in chart');

    chart.update({
        accessibility: {
            landmarkVerbosity: 'one'
        }
    });
    assert.strictEqual(numRegions(chart), 1, 'One landmark in chart');

    chart.update({
        accessibility: {
            landmarkVerbosity: 'all'
        }
    });
    assert.ok(numRegions(chart) > 1, 'More than one landmark');
});

QUnit.test('exposeAsGroupOnly', function (assert) {
    const chart = Highcharts.chart('container', {
            accessibility: {
                series: {
                    describeSingleSeries: false
                }
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        series = chart.series[0],
        point = series.points[0];

    assert.ok(getPointAriaLabel(point), 'Point has aria');
    assert.notOk(isPointAriaHidden(point), 'Point is not aria hidden');
    assert.notOk(getSeriesAriaLabel(chart.series[0]), 'Series does not have aria');

    series.update({
        accessibility: {
            exposeAsGroupOnly: true
        }
    });

    assert.ok(isPointAriaHidden(point), 'Point is aria hidden');
    assert.ok(getSeriesAriaLabel(chart.series[0]), 'Series has aria');
});