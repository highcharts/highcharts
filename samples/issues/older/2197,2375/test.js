function test(chart) { // eslint-disable-line no-unused-vars
    var point = chart.series[0].points[2];

    // Set hoverPoint
    point.onMouseOver();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: point.plotX + chart.plotLeft,
        pageY: point.plotY + chart.plotTop,
        target: chart.container
    });
}