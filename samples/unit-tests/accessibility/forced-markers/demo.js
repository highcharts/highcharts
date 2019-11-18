// Marker testing functions
function hasMarker(point) {
    return !!point.graphic;
}
function hasVisibleMarker(point) {
    return hasMarker(point) && point.graphic.opacity !== 0;
}

QUnit.test('No series markers', function (assert) {
    const chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }),
        point = chart.series[0].points[1];

    // Markers should exist and not be visible
    assert.strictEqual(hasMarker(point), true, 'Marker exists');
    assert.strictEqual(hasVisibleMarker(point), false, 'Marker hidden');
});

QUnit.test('Too many points for markers', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4],
                marker: {
                    enabledThreshold: 100
                }
            }]
        }),
        point = chart.series[0].points[1];

    // Markers should not exist
    assert.strictEqual(hasMarker(point), false, 'No markers');
});

QUnit.test('Too many points for a11y', function (assert) {
    const chart = Highcharts.chart('container', {
            accessibility: {
                series: {
                    pointDescriptionEnabledThreshold: 1
                },
                keyboardNavigation: {
                    seriesNavigation: {
                        pointNavigationEnabledThreshold: 1
                    }
                }
            },
            series: [{
                marker: {
                    enabled: false
                },
                data: [1, 2, 3, 4]
            }]
        }),
        point = chart.series[0].points[1];

    // Markers should not exist
    assert.strictEqual(hasMarker(point), false, 'No markers');
});

QUnit.test('Markers enabled', function (assert) {
    const chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    marker: {
                        enabled: true
                    }
                }
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }),
        point = chart.series[0].points[1];

    // Markers should exist and be visible
    assert.strictEqual(hasMarker(point), true, 'Marker exists');
    assert.strictEqual(hasVisibleMarker(point), true, 'Marker visible');
});

QUnit.test('Markers enabled, point marker off', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, {
                    y: 3,
                    marker: {
                        enabled: false
                    }
                }, 4]
            }]
        }),
        pointA = chart.series[0].points[1],
        pointB = chart.series[0].points[2];

    // Markers should exist and be visible, point marker should not be visible
    assert.strictEqual(hasMarker(pointA), true, 'Series marker exists');
    assert.strictEqual(hasVisibleMarker(pointA), true, 'Series marker visible');
    assert.strictEqual(hasMarker(pointB), true, 'Point marker exists');
    assert.strictEqual(hasVisibleMarker(pointB), false, 'Point marker hidden');
});

QUnit.test('Markers disabled, point marker off', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                marker: {
                    enabled: false
                },
                data: [1, 2, {
                    y: 3,
                    marker: {
                        enabled: false
                    }
                }, 4]
            }]
        }),
        pointA = chart.series[0].points[1],
        pointB = chart.series[0].points[2];

    // Markers should exist and not be visible
    assert.strictEqual(hasMarker(pointA), true, 'Series marker exists');
    assert.strictEqual(hasVisibleMarker(pointA), false, 'Series marker hidden');
    assert.strictEqual(hasMarker(pointB), true, 'Point marker exists');
    assert.strictEqual(hasVisibleMarker(pointB), false, 'Point marker hidden');
});

QUnit.test('Markers disabled, point marker on', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                marker: {
                    enabled: false
                },
                data: [1, 2, {
                    y: 3,
                    marker: {
                        enabled: true
                    }
                }, 4]
            }]
        }),
        pointA = chart.series[0].points[1],
        pointB = chart.series[0].points[2];

    // Markers should exist and not be visible, point marker should be visible
    assert.strictEqual(hasMarker(pointA), true, 'Series marker exists');
    assert.strictEqual(hasVisibleMarker(pointA), false, 'Series marker hidden');
    assert.strictEqual(hasMarker(pointB), true, 'Point marker exists');
    assert.strictEqual(hasVisibleMarker(pointB), true, 'Point marker visible');
});

QUnit.test('Dynamic markers on update', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                type: 'arearange',
                marker: {
                    enabled: false
                },
                data: [[1, 2], [2, 3], {
                    low: 3,
                    high: 4,
                    marker: {
                        enabled: true
                    }
                }, [4, 5]]
            }]
        }),
        series = chart.series[0];

    series.update({
        marker: {
            enabled: true
        }
    });

    series.points[2].update({
        marker: {
            enabled: false
        }
    });

    const pointA = series.points[1],
        pointB = series.points[2];

    // Markers should exist and be visible, point marker should not be visible
    assert.strictEqual(hasMarker(pointA), true, 'Series marker exists');
    assert.strictEqual(hasVisibleMarker(pointA), true, 'Series marker visible');
    assert.strictEqual(hasMarker(pointB), true, 'Point marker exists');
    assert.strictEqual(hasVisibleMarker(pointB), false, 'Point marker hidden');
});