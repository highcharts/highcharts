$(function () {
	QUnit.test('Events should be bind to all plotBands.', function (assert) {
		var clicked,
			chart = Highcharts.stockChart('container', {
				xAxis: {
					min: 20,
					max: 50,
					plotBands: [{
						color: '#FCFFC5',
						from: 0,
						to: 11,
						id: 'plotband-1',
						events: {
							click: function (event) {
								console.log('ok');
								clicked = 'clicked';
							}
						}
					}]
				},
				series: [{
					data: [
						[1, 20],
						[11, 20],
						[21, 25],
						[41, 28],
					]
				}]
			}),
			offset = Highcharts.offset(chart.container),
			event = $.Event('click', {
				which: 1,
 				pageX: offset.left + 100,
 				pageY: offset.top + 100
 			});

		chart.xAxis[0].setExtremes(0, 10);
		
		$(chart.xAxis[0].plotLinesAndBands[0].svgElem.element).trigger(event);

		assert.deepEqual(
			clicked,
			'clicked',
			'Click event fired'
		);
	});
});