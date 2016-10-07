function test(chart) { // eslint-disable-line no-unused-vars
    var point = chart.series[0].points[2],
        offset = $(chart.container).offset();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: offset.left + chart.plotLeft + chart.plotWidth - 10,
        pageY: point.plotY + chart.plotTop + offset.top,
        target: chart.container
    });

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}