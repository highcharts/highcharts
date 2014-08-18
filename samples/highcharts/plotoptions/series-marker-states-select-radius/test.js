function test(chart) {
	chart.series[0].points[4].select();
	chart.getSVG = function () {
		return chart.container.innerHTML;
	}
}