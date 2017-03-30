/* eslint valid-jsdoc: 0 */
/* global Highcharts, document, window */
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

    var controller;

    /**
     * Get offset of an element.
     * @param  {string} type  Event type
     * @returns {object} Element offset
     */
    function getOffset(el) {
        return Highcharts.offset(el);
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
    function triggerEvent(type, pageX, pageY, extra, el) {
        var evt = document.createEvent('Events'),
            element;
        evt.initEvent(type, true, true);
        evt.pageX = pageX;
        evt.pageY = pageY;

        if (extra) {
            Object.keys(extra).forEach(function (key) {
                evt[key] = extra[key];
            });
        }

        // Find an element related to the coordinates and fire event.
        element = el || document.elementFromPoint(pageX, pageY);
        if (element) {
            element.dispatchEvent(evt);
        }
    }

    /**
     * mouseMoving - description
     *
     * @param  {type} x0       description
     * @param  {type} y0       description
     * @param  {type} x1       description
     * @param  {type} y1       description
     * @param  {type} interval description
     * @return {type}          description
     */
    function getPointsBeetween(a, b, interval) {
        var points = [],
            complete = false,
            x1 = b.x,
            y1 = b.y,
            x0 = a.x,
            y0 = a.y,
            deltaX,
            deltaY,
            distance,
            ratio,
            moveX,
            moveY;
        points.push([x0, y0]);
        while (!complete) {
            deltaX = x1 - x0;
            deltaY = y1 - y0;
            distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
            if (distance > interval) {
                ratio = interval / distance;
                moveX = ratio * deltaX;
                moveY = ratio * deltaY;
                x0 += moveX;
                y0 += moveY;
                points.push([x0, y0]);
            } else {
                points.push([b.x, b.y]);
                complete = true;
            }
        }
        return points;
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

        // Leave marks for debugging
        if (typeof x === 'number' && typeof y === 'number') {
            chart.renderer.circle(
                x,
                y,
                {
                    mousedown: 3,
                    mousemove: 2
                }[type] || 3

            ).attr({
                'fill': 'white',
                'stroke': {
                    mousedown: 'green',
                    mousemove: 'blue'
                }[type] || 'red',
                'stroke-width': {
                    mousedown: 2,
                    mousemove: 1
                }[type] || 2,
                'zIndex': 100
            }).css({
                'pointer-events': 'none'
            }).add();
        }

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
    controller = {
        positionX: null,
        positionY: null,
        relatedTarget: null,
        /**
         * setPosition - Move the cursor position to a new position, without fire events.
         *
         * @param  {Number} x New x position on the page.
         * @param  {Number} y New y position on the page.
         * @return {undefined} Pure setter.
         */
        setPosition: function (x, y) {
            this.positionX = x;
            this.positionY = y;
            this.relatedTarget = document.elementFromPoint(x, y);
        },
        /**
         * setPosition - Move the cursor position to a new position,
         *  relative to an element, without fire events.
         *
         * @param  {Number} x New x position on the page.
         * @param  {Number} y New y position on the page.
         * @return {undefined} Pure setter.
         */
        setPositionToElement: function (el, x, y) {
            var elOffset = getOffset(el),
                x1 = elOffset.left + (x || 0),
                y1 = elOffset.top + (y || 0);
            this.setPosition(x1, y1);
        },
        /**
         * getPosition - Get the current position of the cursor.
         *
         * @return {Object} Object containing x, y and relatedTarget.
         */
        getPosition: function () {
            var c = this,
                position = {
                    x: c.positionX,
                    y: c.positionY,
                    relatedTarget: c.relatedTarget
                };
            return position;
        },
        /**
         * moveTo - Move the cursor from current position to a new one.
         *  Fire a series of mousemoves, also mouseout and mouseover if new targets are found.
         *
         * @param  {Number} x New x position on the page.
         * @param  {Number} y New y position on the page.
         * @return {undefined}
         */
        moveTo: function (x, y) {
            var c = this,
                interval = 1,
                relatedTarget = c.relatedTarget,
                from = c.getPosition(),
                to = { x: x, y: y },
                points = getPointsBeetween(from, to, interval);
            points.forEach(function (p) {
                var x1 = p[0],
                    y1 = p[1],
                    target = document.elementFromPoint(x1, y1);
                triggerEvent('mousemove', x1, y1);
                if (target !== relatedTarget) {
                    // First trigger a mouseout on the old target.
                    triggerEvent('mouseout', x1, y1, {
                        relatedTarget: target
                    }, relatedTarget);
                    // Then trigger a mouseover on the new target.
                    triggerEvent('mouseover', x1, y1, {
                        relatedTarget: target
                    });
                    relatedTarget = target;
                }
            });

            // Update controller positions and relatedTarget.
            c.setPosition(x, y);
        },
        /**
         * moveTo - Move the cursor from current position to a new one.
         *  Fire a series of mousemoves, also mouseout and mouseover if new targets are found.
         *
         * @param  {Element} el The element to move towards.
         * @param  {Number} x New x position relative to the element.
         * @param  {Number} y New y position relative to the element.
         * @return {undefined}
         */
        moveToElement: function (el, x, y) {
            var elOffset = getOffset(el),
                x1 = elOffset.left + (x || 0),
                y1 = elOffset.top + (y || 0);
            this.moveTo(x1, y1);
        },
        // Pure functions without states
        trigger: trigger,
        triggerOnChart: triggerOnChart,
        triggerOnElement: triggerOnElement,
        getOffset: getOffset,
        getPointsBeetween: getPointsBeetween
    };
    // Shorthand functions. Calls trigger, except the type.
    [
        'click',
        'mousedown',
        'mousemove',
        'mouseup',
        'mouseout',
        'mouseover',
        'touchstart',
        'touchmove',
        'touchend'
    ].forEach(function (type) {
        controller[type] = function (x, y, extra) {
            trigger(type, x, y, extra);
        };
    });
    controller.setPositionToElement(chart.container);
    return controller;
};
