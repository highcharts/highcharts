$(function () {
	QUnit.test('Waterfall should render stacks.', function (assert) {
		var chart = new Highcharts.Chart({
			chart: {
				type: 'waterfall',
				renderTo: 'container'
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},
			series: [{
				data: [5561.52, 5561.52, 5561.52, 5561.52]
			}, {
				data: [11178.45, 11178.45, 11178.45, 11178.45]
			}]
		}),
		UNDEFINED;

		assert.strictEqual(
			chart.series[0].points[0].graphic !== UNDEFINED,
			true,
			'First points correctly rendered.'
		);
	});
});
