function test(chart) { // eslint-disable-line no-unused-vars

    // Second point, in order to unselect the first
    var point = chart.series[0].points[202]; // USA

    // First mouse over to set hoverPoint
    point.onMouseOver();

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}