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

