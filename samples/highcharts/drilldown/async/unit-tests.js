QUnit.test('Async drilldown', function (assert) {
    var chart = Highcharts.charts[0],
        done = assert.async();

    chart.options.drilldown.animation = false;

    assert.equal(
        chart.series[0].name,
        'Things',
        'Warming up'
    );

    // Click first point
    Highcharts.fireEvent(chart.series[0].points[0], 'click');
    assert.equal(
        chart.series[0].name,
        'Things',
        '0 ms - no changes'
    );

    setTimeout(function () {
        assert.equal(
            chart.series[0].name,
            'Things',
            '600 ms - no changes'
        );
        assert.equal(
            chart.loadingShown,
            true,
            '600 ms - loading shown'
        );
    }, 600);

    setTimeout(function () {
        assert.equal(
            chart.series[0].name,
            'Animals',
            '1200 ms - drilled down'
        );

        assert.equal(
            chart.loadingShown,
            false,
            '1200 ms - loading hidden'
        );

        done();
    }, 1200);

});