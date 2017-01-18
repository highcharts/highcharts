$(function () {

	QUnit.test('Yellow circle should be on the top of green circle', function (assert) {
		var chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container',
				type: 'scatter',
				options3d: {
					enabled: true,
					alpha: 10,
					beta: 50,
					depth: 500,
					viewDistance: 5,
				}
			},
			xAxis: {
				min: 0,
				max: 10
			},
			yAxis: {
				min: 0,
				max: 10
			},
			zAxis: {
				min: 0,
				max: 10,
				inverted: true
			},
			series: [{
				marker: {
					radius: 20
				},
				data: [{
					x: 3,
					y: 4.4,
					z: 8,
					color: 'green'
				}, {
					x: 7.9,
					y: 7.1,
					z: 2,
					color: 'yellow',
				}]
			}]
		});
		var data = chart.series[0].data;

		assert.strictEqual(
			(data[0].graphic.zIndex < data[1].graphic.zIndex),
			true,
			'zIndex is correct for scatter series'
		);
	});
});
