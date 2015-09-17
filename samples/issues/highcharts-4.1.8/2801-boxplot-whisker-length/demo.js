$(function () {
    QUnit.test('Whiskers set by number and by percentage (string)', function (assert) {
        
        $('#container').highcharts({
			chart: {
				type: 'boxplot',
				width: 405
			},
			plotOptions: {
				series: {
					grouping: false
				}
			},
			series: [{
				whiskerLength: '50%',
				data: [
					[760, 801, 848, 895, 965],
					[760, 801, 848, 895, 965]
				]
			},{
				whiskerLength: 42,
				data: [
					[2, 760, 801, 848, 895, 965]
				]
			}]
		});

        var chart = $('#container').highcharts();
            
        assert.strictEqual(
            chart.series[0].points[0].whiskers.attr('d'),
			'M 41 31 L 66 31 M 41 212 L 66 212',
            'whiskerLength set by percent'
        );
		assert.strictEqual(
            chart.series[1].points[0].whiskers.attr('d'),
            'M 239.5 31 L 281.5 31 M 239.5 212 L 281.5 212',
            'whiskerLength set by number'
        );

    });
});