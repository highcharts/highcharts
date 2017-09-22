QUnit.test('csv-datetime-short-year-2000', function (assert) {
    var chart = Highcharts.charts[0],
        options = chart.options
    ;

    assert.strictEqual(
        (Highcharts.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis).type,
        'datetime',
        'X axis is date/time'
    );

	assert.strictEqual(
		(chart.options.series[0].data[0][0]),
		1452470400000,
		'Date for point one is correct'
	);

	assert.strictEqual(
		(chart.options.series[0].data[0][1]),
		4,
		'Data for point one is correct'
	);
});
