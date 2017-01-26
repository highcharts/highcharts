$(function () {
	QUnit.test('Chart should be initialised when xAxis.min and rangeselector.selected are defined.', function (assert) {
		var chart = Highcharts.stockChart('container', {
			rangeSelector: {
				selected: 3 // YTD
			},
			series: [{
				data: [1,2,3]
			}],
			xAxis: [{
				max: 1
			}]
		});
		
		assert.deepEqual(
			chart.xAxis[0].oldMax !== null,
			true,
			'Chart is initialised.'
		);
	});
});