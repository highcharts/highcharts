function test(chart) { // eslint-disable-line no-unused-vars

    // Grab the left handle
    chart.scroller.handlesMousedown({
        type: 'mousedown',
        pageX: 475,
        pageY: 250
    }, 0);

    // Drag it to the left
    chart.scroller.mouseMoveHandler({
        type: 'mousemove',
        pageX: 425,
        pageY: 250
    });

    chart.scroller.scrollbar.rendered = false; // prevent animation

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