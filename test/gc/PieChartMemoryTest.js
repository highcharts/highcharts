var PieChartMemoryTest = TestCase("PieChartMemoryTest");

PieChartMemoryTest.prototype = new ChartMemoryTest();

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

