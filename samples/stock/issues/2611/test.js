function test(chart) {

    // Grab the left handle
    chart.scroller.mouseDownHandler({
        type: 'mousedown',
        pageX: 475,
        pageY: 250
    });

    // Drag it to the left
    chart.scroller.mouseMoveHandler({
        type: 'mousemove',
        pageX: 425,
        pageY: 250
    });

    // Drag it all the way to the right
    chart.scroller.mouseMoveHandler({
        type: 'mousemove',
        pageX: 485,
        pageY: 250
    });

    // Drop
    chart.scroller.mouseUpHandler({
        type: 'mouseup'
    });

    // Use the real SVG
    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}