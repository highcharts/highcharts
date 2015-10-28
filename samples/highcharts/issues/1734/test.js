function test(chart) {

    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: 200,
        pageY: 200
    });

    chart.pointer.onContainerMouseMove({
        pageX: 300,
        pageY: 200
    });

    chart.pointer.onDocumentMouseUp({});

    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}