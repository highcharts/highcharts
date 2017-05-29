$(function () {
	QUnit.test('Navigator\'s width should be the same as xAxis, even after hiding all series.', function (assert) {
		var chart = Highcharts.stockChart('container', {
			legend: {
				enabled: true
			},
			yAxis: {
				labels: {
					align: 'left'
				}
			},
			series: [{
				data: [1, 2, 3],
				id: '1'
			}]
		});

		chart.series[0].hide();

		assert.deepEqual(
			chart.scroller.size,
			chart.scroller.xAxis.len,
			'Correct width'
		);
	});
});