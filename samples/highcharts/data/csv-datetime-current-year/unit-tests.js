QUnit.test('csv-current-year', function (assert) {
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
		979603200000,
		'Date for point one is correct'
	);
});
