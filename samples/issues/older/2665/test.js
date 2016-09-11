function test(chart) { // eslint-disable-line no-unused-vars

    chart.series[0].onMouseOver();

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 190,
        pageY: 70,
        target: chart.container
    });

    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}