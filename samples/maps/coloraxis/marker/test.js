function test(chart) {

	// Second point, in order to unselect the first
	point = chart.series[0].points[202]; // USA

	// First mouse over to set hoverPoint
	point.onMouseOver();

	// Now hover it
	chart.pointer.onContainerMouseMove({
		type: 'mousemove',
		pageX: 100,
		pageY: 100,
		target: chart.container
	});

	chart.getSVG = function () {
		return this.container.innerHTML;
	}
};