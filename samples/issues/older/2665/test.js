function test(chart) {

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