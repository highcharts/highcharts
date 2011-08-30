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

	this.config = {
		chart: {
			renderTo: this.container
		},
		series: [{
			type: 'scatter',
			data: this.randomData(1)
		}]
	};

	this.chart = new Chart(this.config);
	assertNotUndefined(this.chart);
};

/**
 * At tear down, log output from the element monitor and reset.
 */
ChartMemoryTest.prototype.tearDown = function () {
	elementMonitor.log();
	elementMonitor.reset();

	// Enable it again for other tests
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

	this.chart.destroy();
	this.chart = null;
};

/**
 * Tests SVG allocations when destroying.
 */
ChartMemoryTest.prototype.testDestroyChart = function () {
	this.chart.destroy();
	this.chart = null;
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

	this.chart.destroy();
	this.chart = null;
};

/**
 * Tests SVG allocations when redrawing the chart.
 */
ChartMemoryTest.prototype.testRedrawChart = function () {
	var i;

	for (i = 0; i < 2; i++) {
		this.chart.redraw(true);
	}
	this.chart.destroy();
	this.chart = null;
};

/**
 * Tests SVG allocations when resizing the chart.
 */
ChartMemoryTest.prototype.testSetSizeChart = function () {
	var i;

	for (i = 1; i < 10; i++) {
		this.chart.setSize(100 * i, 100 * i, true);
	}

	this.chart.destroy();
	this.chart = null;
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

	this.chart.destroy();
	this.chart = null;
};
