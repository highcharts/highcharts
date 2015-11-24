function test(chart) {
    var point = chart.series[0].points[2],
        offset = $(chart.container).offset();

    // Set hoverPoint
    chart.hoverSeries = point.series; // emulates element onmouseover
    point.onMouseOver();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 310,
        pageY: 300,
        target: chart.container
    });

}