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
		xAxis: {
			min: 0,
			max: 10
		},
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
		'Axis.toPixels() in horizontal linear axis, chart coordinates', 
		150, 
		chart.xAxis[0].toPixels(5)
	);

	assertEquals(
		'Axis.toPixels() in horizontal linear axis, plot coordinates', 
		50, 
		chart.xAxis[0].toPixels(5, true)
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
		'Axis.toValue() in horizontal linear axis, chart coordinates',
		5,
		chart.xAxis[0].toValue(150)
	);
	
	assertEquals(
		'Axis.toValue() in horizontal linear axis, plot coordinates',
		5,
		chart.xAxis[0].toValue(50, true)
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

	
}