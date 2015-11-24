QUnit.test('Show-hide series', function (assert) {

    var chart = Highcharts.charts[0],
        series = chart.series[0];

    assert.strictEqual(
        series.group.attr('visibility'),
        'visible',
        'Series visible'
    );

    assert.strictEqual(
        series.yAxis.hasData(),
        true,
        'Axis visible'
    );

    // Hide series
    series.hide();
    assert.strictEqual(
        series.group.attr('visibility'),
        'hidden',
        'Series hidden'
    );
    assert.strictEqual(
        series.yAxis.hasData(),
        false,
        'Axis hidden'
    );

    // Show series
    series.show();
    assert.strictEqual(
        series.group.attr('visibility'),
        'visible',
        'Series visible'
    );
    assert.strictEqual(
        series.yAxis.hasData(),
        true,
        'Axis visible'
    );

});