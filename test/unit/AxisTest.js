AxisTest = TestCase("AxisTest");

AxisTest.prototype.setUp = function() {
	assertUndefined(this.container);
	/*:DOC container = <div style="height: 300px; width: 300px"></div>*/
	assertNotUndefined(this.container);
};

AxisTest.prototype.testToPixelsAndValues = function () {

	// Set up
	var chart = new Chart({
		chart: {
			width: 300,
			height: 300,
			margin: [100, 100, 100, 100],
			renderTo: this.container,
			alignTicks: false
		},
		xAxis: [{
			min: 0,
			max: 10,
			categories: []
		}, {
			min: 0,
			max: 10,
			categories: [],
			reversed: true,
			opposite: true
		}],
		yAxis: [{
			type: 'logarithmic',
			min: 1,
			max: 10
		}, {
			min: 0,
			max: 10,
			reversed: true,
			opposite: true
		}],
		series: [{
			data: [1, 4, 2, 4],
			yAxis: 0
		}, {
			data: [1, 4, 2, 4],
			yAxis: 1
		}]
	});

	// Axis.toPixels
	assertEquals(
		'Axis.toPixels() in horizontal categorized axis, chart coordinates', 
		114, 
		Math.round(chart.xAxis[0].toPixels(1))
	);

	assertEquals(
		'Axis.toPixels() in horizontal categorized axis, plot coordinates', 
		50, 
		Math.round(chart.xAxis[0].toPixels(5, true))
	);

	assertEquals(
		'Axis.toPixels() in vertical log axis, chart coordinates', 
		130, 
		Math.round(chart.yAxis[0].toPixels(5))
	);

	assertEquals(
		'Axis.toPixels(0) in vertical log axis, chart coordinates', 
		Infinity, 
		Math.round(chart.yAxis[0].toPixels(0))
	);

	assertEquals(
		'Axis.toPixels() in vertical reversed axis, chart coordinates', 
		200, 
		Math.round(chart.yAxis[1].toPixels(10))
	);

	// Axis.toValue
	assertEquals(
		'Axis.toValue() in horizontal categorized axis, chart coordinates',
		5,
		Math.round(chart.xAxis[0].toValue(150))
	);
	
	assertEquals(
		'Axis.toValue() in horizontal categorized axis, plot coordinates',
		5,
		Math.round(chart.xAxis[0].toValue(50, true))
	);

	assertEquals(
		'Axis.toValue() in horizontal reversed categorized axis, plot coordinates',
		5,
		Math.round(chart.xAxis[1].toValue(50, true))
	);

	assertEquals(
		'Axis.toValue() in vertical log axis, chart coordinates', 
		5, 
		Math.round(chart.yAxis[0].toValue(130))
	);
	
	assertEquals(
		'Axis.toValue() in vertical log axis, plot coordinates', 
		5, 
		Math.round(chart.yAxis[0].toValue(30, true))
	);
	chart.destroy();

	// Test on inverted chart
	chart = new Chart({
		chart: {
			width: 300,
			height: 300,
			margin: [100, 100, 100, 100],
			renderTo: this.container,
			inverted: true
		},
		xAxis: {
			min: 0,
			max: 10
		},
		yAxis: {
			min: 0,
			max: 10
		},
		series: [{
			data: [1, 4, 2, 4],
			yAxis: 0
		}]
	});

	assertEquals(
		'Axis.toPixels() in inverted Y axis', 
		100, 
		Math.round(chart.yAxis[0].toPixels(0))
	);
	assertEquals(
		'Axis.toValue() in inverted Y axis', 
		0, 
		Math.round(chart.yAxis[0].toValue(100))
	);
	assertEquals(
		'Axis.toPixels() in inverted X axis', 
		100, 
		Math.round(chart.xAxis[0].toPixels(0))
	);
	assertEquals(
		'Axis.toValue() in inverted X axis', 
		0, 
		Math.round(chart.xAxis[0].toValue(100))
	);
	chart.destroy();
	
}