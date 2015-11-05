$(function () {
    QUnit.test("Connector lines cannot go through points." , function (assert) {
        var chart = $('#container').highcharts({
			chart: {
				type: 'waterfall',
				inverted: true,
				height: 195
			},
			title: {
				text: ''
			},
			legend: {
				enabled: false
			},
			yAxis: {
				labels: {
					enabled: false
				},
				title: ''
			},
			series: [{
				pointWidth: 42,
				borderWidth: 0,
				dashStyle: "Solid",
				data: [{
					y: 42
				}, {
					y: 72
				}]
			}]
		}).highcharts(),
			lineLength = chart.series[0].graph.getBBox(true).width,
			points = chart.series[0].points,
			boxP1 = points[0].graphic.getBBox(true),
			boxP2 = points[1].graphic.getBBox(true),
			distanceBetweenPoints = boxP1.x - (boxP2.x + boxP2.width);

        assert.strictEqual(
            lineLength,
            distanceBetweenPoints,
            "Connector line is equal to distance between points.")
    });
});