QUnit.test('csv-deduce-delimiter', function (assert) {
    var chart = Highcharts.charts[0],
        options = chart.options
    ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

    assert.strictEqual(
        options.series[0].data[0][1],
        4,
        'Point 1 is correct'
    );

    assert.strictEqual(
        options.series[0].data[1][1],
        6,
        'Point 2 is correct'
    );

    assert.strictEqual(
        options.series[0].data[2][1],
        7,
        'Point 3 is correct'
    );

});
