function test(chart) {
    var point;

    // First mouse over to set hoverPoint
    point = chart.series[0].points[3];
    point.onMouseOver();

    chart.pointer.onContainerClick({
        type: 'click',
        target: point.graphic.element
    });

    // Select second point
    point = chart.series[0].points[4];
    point.onMouseOver();
    chart.pointer.onContainerClick({
        shiftKey: true,
        type: 'click',
        target: point.graphic.element
    });

    $('#button').click();
}