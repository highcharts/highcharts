$(function () {
	QUnit.test('Correct clip path for series in navigator.', function (assert) {
		var chart = $('#container').highcharts({
			chart: {
				height: 300
			},
			navigator: {
				enabled: true,
				height: 100
			},
			series: [{
				data: [1,2,3]
			}]
		}).highcharts();

		assert.strictEqual(
			chart.series[1].clipBox.height,
			100,
			'navigator series has correct clipping rect height'
		);
	});
});