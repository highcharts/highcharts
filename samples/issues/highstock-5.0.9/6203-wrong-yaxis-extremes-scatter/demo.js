$(function () {
	QUnit.test('yAxis extremes should adapt to visible points, not all.', function (assert) {
		var chart = Highcharts.stockChart('container', {
				series: [{
				  data: [1, 2, 3, 4, 5, 3, 2, 1, 2, 4, 5, 8, 6, 4, 2, 3, 4, 2, 3, 4, 5, 6, 3, 2, 1, 2, 3, 4, 5, 6, 7, 3]
				}, {
					type: "scatter",
					data: [{
					x: 4,
					y: 200,
					}, {
					x: 10,
					y: 2,
					}],

				}]
			});

		chart.xAxis[0].setExtremes(8, 10);
		
		assert.deepEqual(
			chart.yAxis[0].max,
			10,
			'yAxis extremes adapted to visible scatter points.'
		);
	});
});