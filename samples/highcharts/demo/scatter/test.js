function test(chart) {

    // Test the k-d tree when no hoverPoint is set. Moving the mouse over any position
    // in the plot area should trigger a tooltip on the nearest point.
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 350,
        pageY: 250,
        target: chart.container
    });

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}