var BarChartMemoryTest = TestCase("BarChartMemoryTest");

BarChartMemoryTest.prototype = new ChartMemoryTest();

/**
 * Returns the configuration for the charts that we test.
 */
BarChartMemoryTest.prototype.getConfig = function () {
	return {
		chart: {
			type: 'bar'
		},

		series: [{
			data: this.randomData(20)
		}]
	};
};

