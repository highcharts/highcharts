function test(chart) {
    var point = chart.series[1].points[42]; // China

    // First mouse over to set hoverPoint
    point.onMouseOver();

    // Now click it
    chart.pointer.onContainerClick({
        type: 'click',
        target: point.graphic.element
    });
}