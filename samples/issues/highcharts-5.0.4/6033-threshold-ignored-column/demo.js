$(function () {
	QUnit.test('Threshold should be applied when reflow is triggered', function (assert) {
		var chart = Highcharts.Chart('container', {
					series: [{
						data: [80, 100, 60]
					}],
					chart: {
						type: "bar",
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
					setTimeout(function(){
						chart.reflow();
					},100);
				}).highcharts();

		assert.strictEqual(
			chart.yAxis[0].stacks.bar[0].cum,
			90,
			'Threshold is applied'
		);
	});
});