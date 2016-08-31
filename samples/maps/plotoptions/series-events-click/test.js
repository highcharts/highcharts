function test(chart) {
    var point = chart.series[0].points[202]; // US

    // First mouse over to set hoverPoint
    point.onMouseOver();

    // Now click it
    chart.pointer.onContainerClick({
        type: 'click',
        target: point.graphic.element
    });
}