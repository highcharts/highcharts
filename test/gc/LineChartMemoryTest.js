var LineChartMemoryTest = TestCase("LineChartMemoryTest");

LineChartMemoryTest.prototype = new ChartMemoryTest();

/**
 * Returns the configuration for the charts that we test.
 */
LineChartMemoryTest.prototype.getConfig = function () {
	return {
		chart: {
			type: 'line'
		},

		series: [{
			data: this.randomData(20)
		}]
	};
};

