QUnit.test('csv-deduce-format-iso', function (assert) {
    var chart = Highcharts.charts[0],
        options = chart.options
    ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

    assert.strictEqual(
        options.series[0].data[0][0],
        1454025600000,
        'Format is DD/MM/YYYY'
    );

});
