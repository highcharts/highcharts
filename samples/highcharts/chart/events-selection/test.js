function test(chart) { // eslint-disable-line no-unused-vars
    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: 100,
        pageY: 100
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 200,
        pageY: 100
    });
    chart.pointer.onDocumentMouseUp({});
    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}