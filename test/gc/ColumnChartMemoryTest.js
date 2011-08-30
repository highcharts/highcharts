var ColumnChartMemoryTest = TestCase("ColumnChartMemoryTest");

ColumnChartMemoryTest.prototype = new ChartMemoryTest();

/**
 * Returns the configuration for the charts that we test.
 */
ColumnChartMemoryTest.prototype.getConfig = function () {
	return {
		chart: {
			type: 'column'
		},
		series: [{
			data: this.randomData(20)
		}]
	};
};

