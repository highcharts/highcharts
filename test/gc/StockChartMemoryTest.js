var StockChartMemoryTest = TestCase("StockChartMemoryTest");

StockChartMemoryTest.prototype.randomData = function (len) {
	var minDate = 0,
		maxDate = Date.now(),
		startDate = Math.random() * maxDate,
		i = 0,
		arr = [];

	for (i = 0; i < len; i++) {
		arr.push([startDate + i * 1000 * 60 * 60, Math.random()]);
	}

	return arr;
};

/**
 * Setup:
 * - Creates the container div object on the page.
 * - Creates a chart instance.
 */
StockChartMemoryTest.prototype.setUp = function () {
	assertUndefined(this.container);
	/*:DOC += <div id="container" style="height: 200px; width: 200px"></div> */
	this.container = document.getElementById('container');
	assertNotUndefined(this.container);

	// Map the two element functions to call our own instead.
	this.elementMonitor = new ElementMonitor(hasSVG ? SVGElement : VMLElement);

	var conf = merge({}, this.getBaseConfig(), this.getConfig());

	this.chart = new Highcharts.StockChart(conf);
	assertNotUndefined(this.chart);
};

/**
 * Returns the configuration for the charts that we test.
 */
StockChartMemoryTest.prototype.getBaseConfig = function () {
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

		xAxis: {
			ordinal: false
		},

		tooltip: {
			crosshairs: [true, true],
			shadow: true
		},

		series: [{
			data: this.randomData(3)
		}]
	};
};

/**
 * Returns the configuration for the charts that we test.
 */
StockChartMemoryTest.prototype.getConfig = function () {
	return {
		chart: {
			type: 'line'
		}
	};
};

/**
 * At tear down, log output from the element monitor and reset.
 */
StockChartMemoryTest.prototype.tearDown = function () {
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
StockChartMemoryTest.prototype.testAddRemovePoints = function () {
	var i;

	// Test addPoint with shift. This will do a remove point as well.
	for (i = 0; i < 10; i++) {
		this.chart.series[0].addPoint(Math.random(), false, false);
	}
};

/**
 * Tests SVG allocations when calling setData.
 */
StockChartMemoryTest.prototype.testSetData = function () {
	var i;

	// Test setData of random points with redraw.
	for (i = 0; i < 2; i++) {
		this.chart.series[0].setData(this.randomData(10), true);
	}
};

/**
 * Tests SVG allocations when destroying.
 */
StockChartMemoryTest.prototype.testDestroyChart = function () {
	// Just runs setUp and tearDown
};

/**
 * Tests SVG allocations when adding and removing series.
 */
StockChartMemoryTest.prototype.testAddRemoveSeries = function () {
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
StockChartMemoryTest.prototype.testRedrawChart = function () {
	var i;

	for (i = 0; i < 2; i++) {
		this.chart.redraw(false);
	}
};

/**
 * Tests SVG allocations when resizing the chart.
 */
StockChartMemoryTest.prototype.testSetSizeChart = function () {
	var i;

	for (i = 1; i < 10; i++) {
		this.chart.setSize(100 * i, 100 * i, false);
	}
};

