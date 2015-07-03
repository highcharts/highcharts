QUnit.test('Series.update', function (assert) {

	var chart = Highcharts.charts[0],
		lastPoint = function () {
			return chart.series[0].points[chart.series[0].points.length - 1];
		}

	// Markers
	assert.strictEqual(
		lastPoint().graphic,
		undefined,
		'Markers initial'
	);

	$('#markers').click();

	assert.strictEqual(
		lastPoint().graphic.element.nodeName,
		'path',
		'Markers changed'
	);
	

	// Color
	assert.strictEqual(
		chart.series[0].graph.element.getAttribute('stroke'),
		Highcharts.getOptions().colors[0],
		'Color initial'
	);

	$('#color').click();

	assert.strictEqual(
		chart.series[0].graph.element.getAttribute('stroke'),
		Highcharts.getOptions().colors[1],
		'Color changed - graph'
	);
	assert.strictEqual(
		lastPoint().graphic.element.getAttribute('fill'),
		Highcharts.getOptions().colors[1],
		'Color changed - marker'
	);

	// Type line
	$('#line').click();
	assert.strictEqual(
		chart.series[0].type,
		'line',
		'Line type'
	);
	assert.strictEqual(
		lastPoint().graphic.symbolName,
		'circle',
		'Line point'
	);
	
	// Type spline
	$('#spline').click();
	assert.strictEqual(
		chart.series[0].type,
		'spline',
		'Spline type'
	);
	assert.strictEqual(
		chart.series[0].graph.element.getAttribute('d').indexOf('C') !== -1, // has curved path
		true,
		'Curved path'
	);
	
	// Type area
	$('#area').click();
	assert.strictEqual(
		chart.series[0].type,
		'area',
		'Area type'
	);
	assert.strictEqual(
		chart.series[0].area.element.nodeName,
		'path',
		'Has area'
	);
	
	// Type areaspline
	$('#areaspline').click();
	assert.strictEqual(
		chart.series[0].type,
		'areaspline',
		'Areaspline type'
	);
	assert.strictEqual(
		chart.series[0].graph.element.getAttribute('d').indexOf('C') !== -1, // has curved path
		true,
		'Curved path'
	);
	assert.strictEqual(
		chart.series[0].area.element.nodeName,
		'path',
		'Has area'
	);
	
	// Type arearange
	$('#arearange').click();
	assert.strictEqual(
		chart.series[0].type,
		'arearange',
		'Arearange type'
	);
	assert.strictEqual(
		chart.series[0].area.element.nodeName,
		'path',
		'Has area'
	);
	
	// Type columnrange
	$('#columnrange').click();
	assert.strictEqual(
		chart.series[0].type,
		'columnrange',
		'Columnrange type'
	);
	assert.strictEqual(
		chart.series[0].area,
		undefined,
		'No area'
	);
	assert.strictEqual(
		lastPoint().graphic.element.nodeName,
		'rect',
		'Has column'
	);
	
	// Type ohlc
	$('#ohlc').click();
	assert.strictEqual(
		chart.series[0].type,
		'ohlc',
		'OHLC type'
	);
	assert.strictEqual(
		chart.series[0].graph,
		undefined,
		'No graph'
	);
	assert.strictEqual(
		lastPoint().graphic.element.nodeName,
		'path',
		'Has path points'
	);
	
	// Type candlestick
	$('#candlestick').click();
	assert.strictEqual(
		chart.series[0].type,
		'candlestick',
		'Candlestick type'
	);
	assert.strictEqual(
		lastPoint().graphic.element.getAttribute('fill'),
		Highcharts.getOptions().colors[1],
		'Filled last point'
	);
	

	
});