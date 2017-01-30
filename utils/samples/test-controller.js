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
window.TestController = function (chart, showEventMarkers) {

    var ret;

    /**
     * Get offset of an element.
     * @param  {string} type  Event type
     * @returns {object} Element offset
     */
    function getOffset(el) {
        return $(el).offset();
    }

    /**
     * addEventMarkerStyles - description
     *
     * @return {undefined}
     */
    function addEventMarkerStyles() {
        var css = [
                '#container {',
                '    position: relative;',
                '}',
                '.event-mousemove {',
                '    background: green;',
                '    width: 5px;',
                '    height: 5px;',
                '    border-radius: 50%;',
                '    display: inline-block;',
                '    position: absolute;',
                '}'
            ].join('\n'),
            textNode = document.createTextNode(css),
            styleElement = document.createElement('style');
        styleElement.appendChild(textNode);
        document.body.appendChild(styleElement);
    }

    /**
     * drawMarkers - description
     *
     * @param  {type} type  description
     * @param  {type} pageX description
     * @param  {type} pageY description
     * @return {type}       description
     */
    function drawEventMarker(type, pageX, pageY) {
        var className = 'event-' + type,
            container = chart.container,
            chartOffset = getOffset(container),
            left = pageX - chartOffset.left,
            top = pageY - chartOffset.top,
            style = 'left: ' + left + 'px; top: ' + top + 'px;',
            span = document.createElement('span');
        span.setAttribute('style', style);
        span.className = className;
        container.appendChild(span);
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
    function triggerEvent(type, pageX, pageY, extra) {
        var evt = document.createEvent('Events');
        evt.initEvent(type, true, true);
        evt.pageX = pageX;
        evt.pageY = pageY;

        if (extra) {
            Object.keys(extra).forEach(function (key) {
                evt[key] = extra[key];
            });
        }

        document.elementFromPoint(pageX, pageY).dispatchEvent(evt);
        if (showEventMarkers) {
            drawEventMarker(type, pageX, pageY);
        }
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
    function triggerOnChart(type, x, y, extra) {
        var offset = getOffset(chart.container),
            pageX = offset.left + (x || 0),
            pageY = offset.top + (y || 0);
        triggerEvent(type, pageX, pageY, extra);
    }

    /**
     * Alias to triggerOnChart.
     * @param  {string} type  Event type
     * @param  {number} x     X relative to the chart container
     * @param  {number} y     Y relative to the chart container
     * @param  {Object} extra Extra properties for the event arguments, for
     *    example `{ shiftKey: true }` to emulate that the shift key has been
     *    pressed in a mouse event.
     */
    function trigger(type, x, y, extra) {
        triggerOnChart(type, x, y, extra);
    }

    /**
     * Trigger event next to an element.
     * @param  {string} type  Event type
     * @param  {number} x     X relative to the element offset
     * @param  {number} y     Y relative to the element offset
     * @param  {Object} extra Extra properties for the event arguments, for
     *    example `{ shiftKey: true }` to emulate that the shift key has been
     *    pressed in a mouse event.
     */
    function triggerOnElement(el, type, x, y, extra) {
        var elOffset = getOffset(el),
            x1 = elOffset.left + (x || 0),
            y1 = elOffset.top + (y || 0);
        triggerEvent(type, x1, y1, extra);
    }

    ret = {
        trigger: trigger,
        triggerOnChart: triggerOnChart,
        triggerOnElement: triggerOnElement
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

    // Add styles to displays event markers.
    if (showEventMarkers) {
        addEventMarkerStyles();
    }

    return ret;
};
