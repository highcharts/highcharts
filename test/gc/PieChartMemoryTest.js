var PieChartMemoryTest = TestCase("PieChartMemoryTest");

PieChartMemoryTest.prototype = new ChartMemoryTest();

PieChartMemoryTest.prototype.testSetData = function () {
	// Disabled until issue #542 is fixed.
}

/**
 * Returns the configuration for the charts that we test.
 */
PieChartMemoryTest.prototype.getConfig = function () {
	return {
		chart: {
			type: 'pie'
		},

		series: [{
			data: this.randomData(5)
		}]
	};
};

PieChartMemoryTest.prototype.testAddRemovePlotBands = function () {
	// Do not run this test in Pie charts.
}

