
QUnit.test('Basic map', function (assert) {
    var chart = Highcharts.mapChart('container', {
        chart: {
            map: 'custom/europe'
        },
        series: [{
            data: [
                ['no', 1], ['se', 2], ['fi', 3], ['gb', 4], ['fr', 5], ['it', 6]
            ]
        }]
    });

    assert.ok(chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'), 'There be screen reader region');
});

QUnit.test('Map with series info', function (assert) {
    var chart = Highcharts.mapChart('container', {
        accessibility: {
            describeSingleSeries: true
        },
        chart: {
            map: 'custom/europe'
        },
        series: [{
            data: [
                ['no', 1], ['se', 2], ['fi', 3], ['gb', 4], ['fr', 5], ['it', 6]
            ]
        }]
    });

    assert.ok(
        chart.series[0].points[0].graphic.element.parentNode.getAttribute('aria-label'),
        'There be ARIA on series'
    );

    assert.ok(chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'), 'There be screen reader region');
});

QUnit.test('Map with point info', function (assert) {
    var chart = Highcharts.mapChart('container', {
        accessibility: {
            pointDescriptionThreshold: false
        },
        chart: {
            map: 'custom/europe'
        },
        series: [{
            data: [
                ['no', 1], ['se', 2], ['fi', 3], ['gb', 4], ['fr', 5], ['it', 6]
            ]
        }]
    });

    assert.ok(
        chart.series[0].points[0].graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );
});

QUnit.test('Map navigation', function (assert) {
    var chart = Highcharts.mapChart('container', {
        accessibility: {
            pointDescriptionThreshold: false
        },
        chart: {
            map: 'custom/europe'
        },
        mapNavigation: {
            enabled: true
        },
        series: [{
            data: [
                ['no', 1], ['se', 2], ['fi', 3], ['gb', 4], ['fr', 5], ['it', 6]
            ]
        }]
    });

    assert.ok(
        chart.series[0].points[0].graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );
});
