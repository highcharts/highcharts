$(function () {
	QUnit.test('Threshold should be applied when setSize / reflow is triggered', function (assert) {
		var chart = new Highcharts.Chart({
					series: [{
						data: [80, 100, 60]
					}],
					chart: {
						type: "bar",
						renderTo: 'container',
						height: 175
					},
					yAxis: {
						min: 0
					},
					plotOptions: {
						series: {
							stacking: "normal",
							threshold: 10
						}
					}
				}, function(chart) {
					//chart.setSize(400,300);
				});

		assert.strictEqual(
			chart.yAxis[0].stacks.bar[0].cum,
			90,
			'Threshold is applied'
		);
	});
});