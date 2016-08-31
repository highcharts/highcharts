function test(chart) {

    $('#outer').scrollTop(100);

    // Set hoverPoint
    chart.series[0].points[0].onMouseOver();

    // Move it
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 200,
        pageY: 200
    });

    // Don't go through the export server
    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}