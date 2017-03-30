
QUnit.test('Basic stock chart', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            data: [1, 2, 3, 4, 5, 6]
        }]
    });

    assert.ok(
        chart.series[0].graph.element.getAttribute('aria-label'),
        'There be ARIA on series'
    );

    assert.ok(chart.screenReaderRegion && chart.screenReaderRegion.getAttribute('aria-label'), 'There be screen reader region');
});

QUnit.test('Stock chart with markers', function (assert) {
    var chart = Highcharts.stockChart('container', {
            series: [{
                data: [1, 2, 3, 4, 5, 6],
                marker: {
                    enabled: true
                }
            }]
        }),
        point = chart.series[0].points[0];

    assert.ok(
        point.graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );
});
