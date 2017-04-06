

QUnit.test(
	'Legend item should have positive height (#6519)',
	function (assert) {
		var chart = Highcharts.chart('container', {
			series: [{
				data: [1, 3, 2, 4],
				name: ' '
			}, {
				data: [2, 4, 3, 5],
				name: ' '
			}],
			legend: {
				layout: 'vertical'
			}
		});
		assert.notEqual(
			chart.legend.allItems[0]._legendItemPos[1], chart.legend.allItems[1]._legendItemPos[1],
			'Legend item has positive height'
		);
	}
);