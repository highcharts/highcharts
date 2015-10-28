function test(chart) {
    chart.rangeSelector.clickButton(0, {
        type: 'm',
        count: 1,
        _range: 30 * 24 * 36e5
    });

    var point = chart.series[0].points[2],
        offset = $(chart.container).offset();

    // Set hoverPoint
    point.onMouseOver();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: point.plotX + chart.plotLeft + offset.left,
        pageY: point.plotY + chart.plotTop + offset.top,
        target: chart.container
    });

    chart.getSVG = function () {
        return chart.container.innerHTML;
    };

}