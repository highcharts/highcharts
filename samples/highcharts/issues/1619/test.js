function test(chart) {

    for (var i = 0; i < 3; i++) {
        chart.setSize(chart.chartWidth - 1, chart.chartHeight - 1);
    }

    // Set hoverPoint
    chart.series[0].points[0].onMouseOver();

    // Get actual SVG
    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}