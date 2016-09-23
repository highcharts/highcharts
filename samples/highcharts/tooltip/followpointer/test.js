function test(chart) { // eslint-disable-line no-unused-vars
    var point = chart.series[0].points[2];

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