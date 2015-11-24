function test(chart) {
    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: 100,
        pageY: 100
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 200,
        pageY: 200
    });
    chart.pointer.onDocumentMouseUp({});
    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}