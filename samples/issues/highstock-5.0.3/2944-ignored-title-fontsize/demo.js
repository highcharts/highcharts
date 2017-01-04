$(function () {
	QUnit.test('The title should have correct font-size', function (assert) {

		var chart = $('#container1').highcharts('StockChart', {
			title: {
				text: 'AAPL Stock Price'
			},
			series: [{
				data: [1,2,3]
			}]
		}).highcharts();

		assert.strictEqual(
			chart.title.styles.fontSize,
			"16px",
			'Font size is default 16px'
		);

		Highcharts.setOptions({
			title: {
				style: {
					fontSize: '8px'
				}
			}
		});

		var chart = $('#container2').highcharts('StockChart', {
			title: {
				text: 'AAPL Stock Price'
			},
			series: [{
				data: [1,2,3]
			}]
		}).highcharts();

		assert.strictEqual(
			chart.title.styles.fontSize,
			"8px",
			'Font size is 8px'
		);

		var chart = $('#container3').highcharts('StockChart', {
			title: {
				text: 'AAPL Stock Price',
				style: {
					fontSize: '30px'
				}
			},
			series: [{
				data: [1,2,3]
			}]
		}).highcharts();

		assert.strictEqual(
			chart.title.styles.fontSize,
			"30px",
			'Font size is 30px'
		);
	});
});