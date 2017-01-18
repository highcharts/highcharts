/* eslint valid-jsdoc: 0 */
/* global $, document, window */
/**
 * The test controller makes it easy to emulate mouse stuff.
 *
 * @example
 * // Instanciate
 * var controller = TestController(chart);
 *
 * // Simulate a panning operation
 * controller.mousedown(200, 100, { shiftKey: true });
 * controller.mousemove(150, 100, { shiftKey: true });
 * controller.mouseup();
 */
window.TestController = function (chart) {

    var offset,
        ret;

    /**
     * Update the chart container's offset.
     */
    function updateOffset() {
        offset = $(chart.container).offset();
    }

    /**
     * Trigger an event. The target element will be found based on the
     * coordinates. This function is called behind the shorthand functions like
     * .click() and .mousemove().
     * @param  {string} type  Event type
     * @param  {number} x     X relative to the chart container
     * @param  {number} y     Y relative to the chart container
     * @param  {Object} extra Extra properties for the event arguments, for
     *    example `{ shiftKey: true }` to emulate that the shift key has been
     *    pressed in a mouse event.
     */
    function trigger(type, x, y, extra) {
        updateOffset();

        var pageX = offset.left + (x || 0),
            pageY = offset.top + (y || 0);

        var evt = document.createEvent('Events');
        evt.initEvent(type, true, true);
        evt.pageX = pageX;
        evt.pageY = pageY;

        if (extra) {
            Object.keys(extra).forEach(function (key) {
                evt[key] = extra[key];
            });
        }

        var element = document.elementFromPoint(pageX, pageY);

        // Leave marks for debugging
        if (typeof x === 'number' && typeof y === 'number') {
            chart.renderer.circle(x, y, 3).attr({
                'fill': 'none',
                'stroke': {
                    mousedown: 'green',
                    mousemove: 'blue'
                }[type] || 'red',
                'stroke-width': 2,
                'zIndex': 100
            }).css({
                'pointer-events': 'none'
            }).add();
        }

        (element || document.body).dispatchEvent(evt);

    }

    ret = {
        trigger: trigger
    };

    // Shorthand functions. Calls trigger, except the type.
    [
        'click',
        'mousedown',
        'mousemove',
        'mouseup',
        'touchstart',
        'touchmove',
        'touchend'
    ].forEach(function (type) {
        ret[type] = function (x, y, extra) {
            trigger(type, x, y, extra);
        };
    });

    return ret;
};
