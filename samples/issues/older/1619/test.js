function test(chart) { // eslint-disable-line no-unused-vars

    for (var i = 0; i < 3; i++) {
        chart.setSize(chart.chartWidth - 1, chart.chartHeight - 1, false);
    }

    // Set hoverPoint
    chart.series[0].points[0].onMouseOver();

    // Get actual SVG
    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}