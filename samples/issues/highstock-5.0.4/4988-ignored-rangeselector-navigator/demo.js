$(function () {
	QUnit.test('Rangeselector, scrollbar, navigator should be hidden by setOptions.', function (assert) {

		var chart = $('#container1').highcharts('StockChart', {
			series: [{
				data: [1, 2, 3]
			}]
		}).highcharts();

		assert.strictEqual(
			chart.navigator.enabled && chart.scrollbar.enabled && chart.rangeSelector.enabled,
			undefined,
			'navigator, scrollbar, rangeSelector enabled'
		);

		Highcharts.setOptions({
			scrollbar: {
				enabled: false
			},
			navigator: {
				enabled: false
			},
			rangeSelector: {
				enabled: false
			}
		});

		var chart = $('#container2').highcharts('StockChart', {
			series: [{
				data: [1, 2, 3]
			}]
		}).highcharts();

		assert.strictEqual(
			chart.navigator && chart.scrollbar && chart.rangeSelector,
			undefined,
			'navigator, scrollbar, rangeSelector disabled'
		);

		var chart = $('#container3').highcharts('StockChart', {
			navigator: {
				enabled: false
			},
			scrollbar: {
				enabled: false
			},
			rangeSelector: {
				enabled: false
			},
			series: [{
				data: [1, 2, 3]
			}]
		}).highcharts();

		assert.strictEqual(
			chart.navigator && chart.scrollbar && chart.rangeSelector,
			undefined,
			'navigator, scrollbar, rangeSelector disabled'
		);
	});
});