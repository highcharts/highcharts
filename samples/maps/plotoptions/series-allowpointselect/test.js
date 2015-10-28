function test(chart) {
    var point = chart.series[0].points[203]; // Uruguay

    // First mouse over to set hoverPoint
    point.onMouseOver();

    // Now click it
    chart.pointer.onContainerClick({
        type: 'click',
        target: point.graphic.element
    });

    // Second point, in order to unselect the first
    point = chart.series[0].points[202]; // USA

    // First mouse over to set hoverPoint
    point.onMouseOver();

    // Now click it
    chart.pointer.onContainerClick({
        type: 'click',
        target: point.graphic.element
    });
}