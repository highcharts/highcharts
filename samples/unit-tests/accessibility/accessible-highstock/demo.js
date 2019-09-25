QUnit.test('Basic stock chart', function (assert) {
    var chart = Highcharts.stockChart('container', {
        accessibility: {
            series: {
                pointDescriptionEnabledThreshold: 1
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6]
        }]
    });

    assert.ok(
        chart.series[0].markerGroup.element.getAttribute('aria-label'),
        'There be ARIA on series'
    );

    assert.ok(
        chart.accessibility.components.infoRegions.screenReaderSections.before
            .element.getAttribute('aria-label'),
        'There be screen reader region'
    );
});

QUnit.test('Stock chart with forced markers', function (assert) {
    var chart = Highcharts.stockChart('container', {
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        point = chart.series[0].points[0];

    assert.ok(
        point.graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );
});
