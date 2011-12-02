var ChartMemoryTest = TestCase("ChartMemoryTest");

ChartMemoryTest.prototype.randomData = function (len) {
	var arr = [];

	for (var i = 0; i < len; i++) {
		arr.push(Math.random());
	}
	return arr;
};

/**
 * Setup:
 * - Creates the container div object on the page.
 * - Creates a chart instance.
 */
ChartMemoryTest.prototype.setUp = function () {
	assertUndefined(this.container);
	/*:DOC += <div id="container" style="height: 200px; width: 200px"></div> */
	this.container = document.getElementById('container');
	assertNotUndefined(this.container);

	// Map the two element functions to call our own instead.
	this.elementMonitor = new ElementMonitor(hasSVG ? SVGElement : VMLElement);

	var conf = merge({}, this.getBaseConfig(), this.getConfig());

	this.chart = new Chart(conf);
	assertNotUndefined(this.chart);
};

/**
 * Returns the configuration for the charts that we test.
 */
ChartMemoryTest.prototype.getBaseConfig = function () {
	return {
		chart: {
			renderTo: this.container,
			backgroundColor: {
				linearGradient: [0, 0, 500, 500],
				stops: [
					[0, 'rgb(255, 255, 255)'],
					[1, 'rgb(200, 200, 255)']
				]
			},
			borderWidth: 1,
			plotBorderWidth: 12,
			plotBackgroundColor: '#EFEFEF',
			shadow: true,
			zoomType: 'xy',
			reflow: false,		// cannot have reflow in tests
			width: 200,
			height: 200,
			animation: false	// cannot have animations in tests
		},

		plotOptions: {
			series: {
				animation: false // cannot have animations in tests
			}
		},

		tooltip: {
			crosshairs: [true, true],
			shadow: true
		},

		series: [{
			data: this.randomData(1)
		}]
	};
};

/**
 * Returns the configuration for the charts that we test.
 */
ChartMemoryTest.prototype.getConfig = function () {
	return {
		chart: {
			type: 'scatter'
		}
	};
};

/**
 * At tear down, log output from the element monitor and reset.
 */
ChartMemoryTest.prototype.tearDown = function () {
	var innerDivContainer = this.chart.container;

	// Remove the chart
	this.chart.destroy();
	this.chart = null;

	var domEvents = ['onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onselect', 'onchange', 'onsubmit', 'onreset', 'onfocus', 'onblur', 'ontouchstart', 'ontouchend', 'ontouchenter', 'ontouchleave', 'ontouchmove', 'ontouchcancel'];

	for (var n in domEvents) {
		// Assert that the container do not have any event handler attached
		if (innerDivContainer[domEvents[n]]) {
			jstestdriver.console.log(domEvents[n] + ' handler is still attached');
		}
		assertTrue(n + ' handler is still attached', innerDivContainer[domEvents[n]] === null || innerDivContainer[domEvents[n]] === undefined);
	}

	// Remove the container added to the document.body in setUp.
	assertNotUndefined(this.container);
	document.body.removeChild(this.container);
	this.container = undefined;
	assertUndefined(this.container);

	// Log any stray elements
	this.elementMonitor.log();
	this.elementMonitor.reset();
	this.elementMonitor.disconnect(hasSVG ? SVGElement : VMLElement);
	this.elementMonitor = undefined;
};

/**
 * Tests SVG allocations when adding and removing points.
 */
ChartMemoryTest.prototype.testAddRemovePoints = function () {
	var i;

	// Test addPoint with shift. This will do a remove point as well.
	for (i = 0; i < 10; i++) {
		this.chart.series[0].addPoint(Math.random(), false, false);
	}
};

/**
 * Tests SVG allocations when calling setData.
 */
ChartMemoryTest.prototype.testSetData = function () {
	var i;

	// Test setData of random points with redraw.
	for (i = 0; i < 2; i++) {
		this.chart.series[0].setData(this.randomData(10), true);
	}
};

/**
 * Tests SVG allocations when destroying.
 */
ChartMemoryTest.prototype.testDestroyChart = function () {
	// Just runs setUp and tearDown
};

/**
 * Tests SVG allocations when adding and removing series.
 */
ChartMemoryTest.prototype.testAddRemoveSeries = function () {
	var newSeries,
		i;

	// Test to add Series and remove them
	for (i = 0; i < 2; i++) {
		newSeries = this.chart.addSeries({
			data: this.randomData(100)
		});

		if (newSeries) {
			newSeries.remove(true, false);
			newSeries = null;
		}
	}
};

/**
 * Tests SVG allocations when redrawing the chart.
 */
ChartMemoryTest.prototype.testRedrawChart = function () {
	var i;

	for (i = 0; i < 2; i++) {
		this.chart.redraw(false);
	}
};

/**
 * Tests SVG allocations when resizing the chart.
 */
ChartMemoryTest.prototype.testSetSizeChart = function () {
	var i;

	for (i = 1; i < 10; i++) {
		this.chart.setSize(100 * i, 100 * i, false);
	}
};

/**
 * Tests SVG allocations when renaming the chart.
 */
ChartMemoryTest.prototype.testSetTitleChart = function () {
	var i;

	for (i = 1; i < 2; i++) {
		this.chart.setTitle(
			{
				text: 'New title ' + i,
				style: { color: 'red' }
			},
			{
				text: 'New sub title ' + i,
				style: { color: 'green' }
			}
		);
	}
};

/**
 *Tests SVG allocations when showing and hiding the tooltip.
 */
ChartMemoryTest.prototype.testShowHideTooltip = function () {
	var numPoints = this.chart.series[0].data.length,
		firstPoint = this.chart.series[0].data[0],
		lastPoint = this.chart.series[0].data[numPoints - 1];

	this.chart.tooltip.refresh(firstPoint);
	this.chart.tooltip.hide();
	this.chart.tooltip.refresh(lastPoint);
	this.chart.tooltip.hide();
};

/**
 *Tests SVG allocations when showing and hiding the series.
 */
ChartMemoryTest.prototype.testShowHideSeries = function () {
	this.chart.series[0].hide();
	this.chart.series[0].show();
	this.chart.series[0].hide();
};

ChartMemoryTest.prototype.testAddRemovePlotBands = function () {
	var xAxis = this.chart.xAxis[0],
		yAxis = this.chart.yAxis[0],
		xExtremes = xAxis.getExtremes(),
		yExtremes = yAxis.getExtremes();

	// Add one for each axis
	xAxis.addPlotBand({
			from: xExtremes.dataMin,
			to: xExtremes.dataMax,
			color: '#FCFFC5',
			id: 'plot-band-x'
		});

	yAxis.addPlotBand({
			from: yExtremes.dataMin,
			to: yExtremes.dataMax,
			color: '#FCFFC5',
			id: 'plot-band-y'
		});

	// Remove them
	xAxis.removePlotBand('plot-band-x');
	yAxis.removePlotBand('plot-band-y');

	// Add them again to trigger leak
	xAxis.addPlotBand({
			from: xExtremes.dataMin,
			to: xExtremes.dataMax,
			color: '#FCFFC5',
			id: 'plot-band-x'
		});

	yAxis.addPlotBand({
			from: yExtremes.dataMin,
			to: yExtremes.dataMax,
			color: '#FCFFC5',
			id: 'plot-band-y'
		});
};

ChartMemoryTest.prototype.testPlotLines = function () {
	var xAxis = this.chart.xAxis[0],
		yAxis = this.chart.yAxis[0],
		xExtremes = xAxis.getExtremes(),
		yExtremes = yAxis.getExtremes();

	// Add one for each axis
	xAxis.addPlotLine({
			value: (xExtremes.dataMax - xExtremes.dataMin) / 2,
			color: 'red',
			width: 2,
			id: 'plot-line-x'
		});

	yAxis.addPlotLine({
			value: (yExtremes.dataMax - yExtremes.dataMin) / 2,
			color: 'red',
			width: 2,
			id: 'plot-line-y'
		});

	// Remove them
	xAxis.removePlotBand('plot-line-x');
	yAxis.removePlotBand('plot-line-y');

	// Add them again to trigger leak
	xAxis.addPlotLine({
			value: (xExtremes.dataMax - xExtremes.dataMin) / 2,
			color: 'red',
			width: 2,
			id: 'plot-line-x'
		});

	yAxis.addPlotLine({
			value: (yExtremes.dataMax - yExtremes.dataMin) / 2,
			color: 'red',
			width: 2,
			id: 'plot-line-y'
		});
};

