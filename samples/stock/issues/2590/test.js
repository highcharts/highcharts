function test(chart) {
    var offset = $(chart.container).offset();


    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: offset.left + 200,
        pageY: offset.top + 200
    });

    chart.pointer.onContainerMouseMove({
        pageX: offset.left + 400,
        pageY: offset.top + 200
    });
    chart.pointer.onDocumentMouseUp({
        pageX: offset.left + 400,
        pageY: offset.top + 200
    });
}