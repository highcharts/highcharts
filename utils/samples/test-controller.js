/* eslint valid-jsdoc: 0 */
/* global Highcharts, console, document, window, lolex, SVGElement */
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

    var controller,
        MSPointer = window.MSPointerEvent,
        Pointer = window.PointerEvent;

    /**
     * Mock a TochList element
     * @param {Array} arr The list of touches
     * @returns {Array} Array of touches including required internal methods
     */
    function createTouchList(arr) {
        arr.item = function (i) {
            return this[i];
        };
        return arr;
    }
    /**
     * Get offset of an element.
     * @param  {string} type  Event type
     * @returns {object} Element offset
     */
    function getOffset(el) {
        if (el instanceof SVGElement) {
            console.warn( // eslint-disable-line no-console
                'Careful with getting offset of SVG nodes. ' +
                'IE11 doesn\'t support it. When calling tapOnElement or ' +
                'moveToElement, use the chart.container instead.'
            );
        }
        return Highcharts.offset(el);
    }

    /**
     * Get the element from a point on the page.
     * @param  {Number} pageX
     *         X relative to the page
     * @param  {Number} pageY
     *         Y relateive to the page
     * @return {DOMElement}
     *         An HTML or SVG DOM element
     */
    function elementFromPoint(pageX, pageY) {
        var element,
            clipPaths = {
                elements: [],
                values: []
            };

        // Edge and IE are unable to get elementFromPoint when the group has a
        // clip path. It reports the first underlying element with no clip path.
        if (/(Trident|Edge)/.test(window.navigator.userAgent)) {
            [].slice.call(document.querySelectorAll('[clip-path],[CLIP-PATH]'))
                .forEach(
                    function (elemCP) {
                        clipPaths.elements.push(elemCP);
                        clipPaths.values.push(elemCP.getAttribute('clip-path'));
                        elemCP.removeAttribute('clip-path');
                    }
                );
        }

        element = document.elementFromPoint(pageX, pageY);

        // Reset clip paths for Edge and IE
        clipPaths.elements.forEach(function (elemCP, i) {
            elemCP.setAttribute('clip-path', clipPaths.values[i]);
        });

        return element;
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
        element = el || elementFromPoint(pageX, pageY);
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
            this.relatedTarget = elementFromPoint(x, y);
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
         *  Fire a series of mousemoves, also mouseout and mouseover if new
         *  targets are found.
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
                    target = elementFromPoint(x1, y1);
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
        tap: function (x, y) {
            var target = elementFromPoint(x, y),
                extra = {
                    relatedTarget: target,
                    touches: createTouchList([{
                        pageX: x,
                        pageY: y
                    }])
                };

            triggerEvent('touchstart', x, y, extra, target);
            if (Pointer) {
                triggerEvent('pointerdown', x, y, extra, target);
            } else if (MSPointer) {
                triggerEvent('MSPointerDown', x, y, extra, target);
            }

            if (Pointer) {
                triggerEvent('pointerup', x, y, extra, target);
            } else if (MSPointer) {
                triggerEvent('MSPointerUp', x, y, extra, target);
            }
            triggerEvent('touchend', x, y, extra, target);
        },
        tapOnElement: function (el, x, y) {
            var elOffset = getOffset(el);
            var x1 = elOffset.left + (x || 0),
                y1 = elOffset.top + (y || 0);
            this.tap(x1, y1);
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


/**
 * Convience wrapper for installing lolex and bypassing requestAnimationFrame.
 * @return {Object} The clock object
 */
function lolexInstall() { // eslint-disable-line no-unused-vars
    var ret;
    if (typeof lolex !== 'undefined') {
        window.backupRequestAnimationFrame = window.requestAnimationFrame;
        window.requestAnimationFrame = null;
        // Abort running animations, otherwise they will take over
        Highcharts.timers.length = 0;
        ret = lolex.install();
    }
    return ret;
}

/**
 * Convenience wrapper for uninstalling lolex.
 * @param  {Object} clock The clock object
 * @return {void}
 */
function lolexUninstall(clock) { // eslint-disable-line no-unused-vars

    if (typeof lolex !== 'undefined') {

        clock.uninstall();

        // Reset native requestAnimationFrame
        window.requestAnimationFrame = window.backupRequestAnimationFrame;
        delete window.backupRequestAnimationFrame;
    }
}

/**
 * Convenience wrapper for running timeouts and uninstalling lolex.
 * @param  {Object} clock The clock object
 * @return {void}
 */
function lolexRunAndUninstall(clock) { // eslint-disable-line no-unused-vars

    if (typeof lolex !== 'undefined') {
        clock.runAll();
        lolexUninstall(clock);
    }
}
