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

		xAxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		},

		yAxis: {
			stackLabels: {
				style: {
					color: 'black'
				},
				enabled: true
			}
		},

		plotOptions: {
			column:{
				stacking: 'normal',
				dataLabels: {
					enabled: true,
					color: 'black'
				}
			}
		},

		series: [{
			data: this.randomData(12)
		},{
			data: this.randomData(12)
		}]
	};
};

