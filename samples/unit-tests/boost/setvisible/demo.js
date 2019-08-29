QUnit.test('Boosted series show/hide', function (assert) {

    var chart = Highcharts.chart('container', {
        boost: {
            // Do not allow the chart to force chart-wide boosting
            allowForce: false
        },
        plotOptions: {
            series: {
                boostThreshold: 1
            }
        },
        series: [{
            data: [1, 3, 2, 4],
            visible: false
        }, {
            data: [4, 2, 5, 3]
        }]
    });

    var s = chart.series[0];

    assert.strictEqual(
        s.renderTarget.attr('href').length,
        0,
        'Empty image for the initially hidden series'
    );

    s.show();

    assert.strictEqual(
        s.renderTarget.attr('href').indexOf('data:image/png;base64,'),
        0,
        'Painted image for the visible series'
    );

    s.hide();
    assert.strictEqual(
        s.renderTarget.attr('href').length,
        0,
        'Empty image for the dynamically hidden series'
    );

});

QUnit.test('Boosted and not boosted series - visibility', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                boostThreshold: 1000,
                data: [10, 3]
            }, {
                boostThreshold: 1,
                data: [5, 10]
            }]
        }),
        series = chart.series[0];

    series.hide();
    series.show();
    series.hide();

    assert.strictEqual(
        series.markerGroup.attr('visibility'),
        'hidden',
        'Markers are hidden altogether with series even in the not boosted series (#10013).'
    );
});
