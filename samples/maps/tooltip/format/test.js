function test(chart) { // eslint-disable-line no-unused-vars

    // Second point, in order to unselect the first
    var point = chart.series[0].points[202]; // USA

    // First mouse over to set hoverPoint
    point.onMouseOver();

    // Now hover it
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 100,
        pageY: 205,
        target: chart.container
    });

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}