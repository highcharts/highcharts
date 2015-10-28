function test(chart) {
    var point = chart.series[0].points[1],
        offset = $(chart.container).offset();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: point.plotX + chart.plotLeft + offset.left,
        pageY: point.plotY + chart.plotTop + offset.top,
        target: chart.container
    });

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}