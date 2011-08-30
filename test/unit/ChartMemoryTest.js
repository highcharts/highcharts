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
	addEvent = eventMonitor.internalAdd;
	removeEvent = eventMonitor.internalRemove;
	fireEvent = eventMonitor.internalFire;

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
 * At tear down, log output from the event monitor and reset.
 */
ChartMemoryTest.prototype.tearDown = function() {
	elementMonitor.log();
	elementMonitor.reset();
};

ChartMemoryTest.prototype.testAddRemovePoints = function () {
	var i;

	// Test addPoint with shift. This will do a remove point as well.
	for (i = 0; i < 1000; i++) {
		this.chart.series[0].addPoint(Math.random(), false, true);
	}

	this.chart.destroy();
	this.chart = null;
};

ChartMemoryTest.prototype.testDestroyChart = function() {
	this.chart.destroy();
	this.chart = null;
};

ChartMemoryTest.prototype.tXstAddRemoveSeries = function () {
	var newSeries;

	// Test to add Series and remove them
	for (i = 0; i < 1; i++) {
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
