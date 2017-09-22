QUnit.test('csv-deduce-format-mmddyyyy', function (assert) {
    var chart = Highcharts.charts[0],
        options = chart.options
    ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );


    assert.strictEqual(
        options.series[0].data[2][0],
        1460592000000,
        'Format is DD/MM/YYYY'
    );



});
