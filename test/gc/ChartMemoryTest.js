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
	// Disable the event monitor
	eventMonitor.setEnabled(false);

	assertUndefined(this.container);
	/*:DOC container = <div style="height: 200px; width: 200px"></div>*/
	assertNotUndefined(this.container);

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
			backgroundColor: '#FFFFFF',
			shadow: true,
			zoomType: 'xy'
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
	// Remove the chart
	this.chart.destroy();
	this.chart = null;

	// Log any stray svg elements
	elementMonitor.log();
	elementMonitor.reset();

	// Enable event monitor it again for other tests
	eventMonitor.setEnabled(true);
};

/**
 * Tests SVG allocations when adding and removing points.
 */
ChartMemoryTest.prototype.testAddRemovePoints = function () {
	var i;

	// Test addPoint with shift. This will do a remove point as well.
	for (i = 0; i < 1000; i++) {
		this.chart.series[0].addPoint(Math.random(), false, true);
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
			newSeries.remove(true);
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
		this.chart.redraw(true);
	}
};

/**
 * Tests SVG allocations when resizing the chart.
 */
ChartMemoryTest.prototype.testSetSizeChart = function () {
	var i;

	for (i = 1; i < 10; i++) {
		this.chart.setSize(100 * i, 100 * i, true);
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
