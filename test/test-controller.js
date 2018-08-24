/* eslint valid-jsdoc: 0 */
/* global Highcharts, console, document, window, SVGElement */
/**
 * The test controller makes it easy to emulate mouse stuff.
 *
 * @example
 * // Instanciate
 * var controller = TestController(chart);
 *
 * // Simulate a panning operation
 * controller.pan([200, 100], [150, 100], { shiftKey: true });
 */
window.TestController = function (chart) {

    var controller,
        MSPointer = window.MSPointerEvent,
        Pointer = window.PointerEvent;

    /**
     * Mock a TochList element
     *
     * @param  {Array} arr
     *         The list of touches
     *
     * @return {Array}
     *         Array of touches including required internal methods
     */
    function createTouchList(arr) {
        arr.item = function (i) {
            return this[i];
        };
        return arr;
    }

    /**
     * Get offset of an element.
     *
     * @param  {string} type
     *         Event type
     *
     * @return {object}
     *         Element offset
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
     *
     * @param  {Number} pageX
     *         X relative to the page.
     *
     * @param  {Number} pageY
     *         Y relateive to the page.
     *
     * @return {DOMElement}
     *         HTML or SVG DOM element.
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
     *
     * @param  {string} type
     *         Event type.
     *
     * @param  {number} x
     *         X relative to the chart container
     *
     * @param  {number} y
     *         Y relative to the chart container.
     *
     * @param  {Dictionary} extra
     *         Extra properties for the event arguments, for example
     *         `{ shiftKey: true }` to emulate that the shift key has been
     *         pressed in a mouse event.
     *
     * @param  {*} el
     *         The element to dispath the event on, instead of the coordinates.
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
     * Returns all points between a movement.
     *
     * @param  {Dictionary<number>} a
     *         First point as {x, y}.
     *
     * @param  {Dictionary<number>} b
     *         Second point as {x, y}.

     * @param  {number} interval
     *         The distance between points.
     *
     * @return {Array<Array<number>>}
     *         Array of points as [x, y].
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
     *
     * @param  {string} type
     *         Event type
     *
     * @param  {number} x
     *         X relative to the chart container
     *
     * @param  {number} y
     *         Y relative to the chart container
     *
     * @param  {Dictionary} extra
     *         Extra properties for the event arguments, for example
     *         `{ shiftKey: true }` to emulate that the shift key has been
     *         pressed in a mouse event.
     *
     * @param  {boolean} debug
     *         Add marks where the event was triggered. Should not be enabled in
     *         production, as it slows down the test and also leaves an element
     *         that might catch events and mess up the test result.
     */
    function triggerOnChart(type, x, y, extra, debug) {
        var offset = getOffset(chart.container),
            pageX = offset.left + (x || 0),
            pageY = offset.top + (y || 0);

        // Leave marks for debugging
        if (debug && typeof x === 'number' && typeof y === 'number') {
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
     * Trigger event next to an element.
     *
     * @param  {string} type
     *         Event type
     *
     * @param  {number} x
     *         X relative to the element offset.
     *
     * @param  {number} y
     *         Y relative to the element offset
     *
     * @param  {Dictionary} extra
     *         Extra properties for the event arguments, for example
     *         `{ shiftKey: true }` to emulate that the shift key has been
     *         pressed in a mouse event.
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
         * Move the cursor position to a new position, without fire events.
         *
         * @param  {number} x
         *         New x position on the page.
         *
         * @param  {number} y
         *         New y position on the page.
         *
         * @return {void}
         *         Pure setter.
         */
        setPosition: function (x, y) {
            this.positionX = x;
            this.positionY = y;
            this.relatedTarget = elementFromPoint(x, y);
        },
        /**
         * Move the cursor position to a new position, relative to an element,
         * without firing events.
         *
         * @param  {number} x
         *         New x position on the page.
         *
         * @param  {number} y
         *         New y position on the page.
         *
         * @return {void}
         *         Pure setter.
         */
        setPositionToElement: function (el, x, y) {
            var elOffset = getOffset(el),
                x1 = elOffset.left + (x || 0),
                y1 = elOffset.top + (y || 0);
            this.setPosition(x1, y1);
        },
        /**
         * Get the current position of the cursor.
         *
         * @return {Dictionary}
         *         Object containing x, y and relatedTarget.
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
         * Move the cursor from current position to a new one. Fire a series of
         * mousemoves, also mouseout and mouseover if new targets are found.
         *
         * @param  {number} x
         *         New x position on the page.
         *
         * @param  {number} y
         *         New y position on the page.
         *
         * @param  {Dictionary} extra
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @return {void}
         */
        moveTo: function (x, y, extra) {
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
                triggerEvent('mousemove', x1, y1, extra);
                if (target !== relatedTarget) {
                    // First trigger a mouseout on the old target.
                    triggerEvent('mouseout', x1, y1, Highcharts.merge({
                        relatedTarget: target
                    }, extra), relatedTarget);
                    // Then trigger a mouseover on the new target.
                    triggerEvent('mouseover', x1, y1, Highcharts.merge({
                        relatedTarget: target
                    }, extra));
                    relatedTarget = target;
                }
            });

            // Update controller positions and relatedTarget.
            c.setPosition(x, y);
        },
        /**
         * Move the cursor from current position to a new one. Fire a series of
         * mousemoves, also mouseout and mouseover if new targets are found.
         *
         * @param  {DOMElement} el
         *         The HTML or SVG element to move towards.
         *
         * @param  {number} x
         *         New x position relative to the element.
         *
         * @param  {number} y
         *         New y position relative to the element.
         *
         * @param  {Dictionary} extra
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @return {void}
         */
        moveToElement: function (el, x, y, extra) {
            var offset = getOffset(el);
            this.moveTo(
                (offset.left + (x || 0)),
                (offset.top + (y || 0)),
                extra
            );
        },
        /**
         * Simulates a pan action between two points.
         *
         * @param  {Array<number>} point1
         *         Starting point with x and y value.
         *
         * @param  {Array<number>} point2
         *         Ending point with x any y value.
         *
         * @param  {Dictionary} extra
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @param  {boolean} debug
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         */
        pan: function (point1, point2, extra, debug) {
            this.setPosition(point1[0], point1[1]);
            this.mouseDown(point1[0], point1[1], extra, debug);
            this.moveTo(point2[0], point2[1], extra);
            this.mouseUp(point2[0], point2[1], extra, debug);
        },
        /**
         * Simulates a pan action between two points.
         *
         * @param  {Array<number>} element1
         *         Starting element
         *
         * @param  {Array<number>|null|undefined} point1
         *         Relative position with x and y value.
         *
         * @param  {Array<number>} element2
         *         Ending element
         *
         * @param  {Array<number>|null|undefined} point2
         *         Relative position with x any y value.
         *
         * @param  {Dictionary} extra
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @param  {boolean} debug
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         */
        panToElement: function (element1, point1, element2, point2, extra, debug) {

            var offset1 = getOffset(element1),
                offset2 = getOffset(element2);

            point1 = (point1 || []);
            point2 = (point2 || []);

            this.drag(
                (offset1.left + (point1[0] || 0)),
                (offset1.top + (point1[1] || 0)),
                (offset2.left + (point2[0] || 0)),
                (offset2.top + (point2[1] || 0)),
                extra,
                debug
            );
        },
        /**
         * Simulates a tab action with a finger.
         *
         * @param {number} x
         *        X position to tab on
         *
         * @param {number} y
         *        Y position to tab on
         */
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
        /**
         * Simulates a tab action with a finger on an element.
         *
         * @param {DOMElement} el
         *        Element to tab on
         *
         * @param {number} x
         *        X position relative to the element
         *
         * @param {number} y
         *        Y position relative to the element
         */
        tapOnElement: function (el, x, y) {
            var elOffset = getOffset(el);
            var x1 = elOffset.left + (x || 0),
                y1 = elOffset.top + (y || 0);
            this.tap(x1, y1);
        },
        // Pure functions without states
        triggerEvent: triggerEvent,
        triggerOnChart: triggerOnChart,
        triggerOnElement: triggerOnElement,
        getOffset: getOffset,
        getPointsBeetween: getPointsBeetween
    };
    // Shorthand functions. Calls trigger, except the type.
    [
        'click',
        'mouseDown',
        'mouseMove',
        'mouseUp',
        'mouseOut',
        'mouseOver',
        'touchStart',
        'touchMove',
        'touchEnd'
    ].forEach(function (type) {
        let typeLC = type.toLowerCase();
        /**
         * Triggers an event.
         *
         * @param  {number} x
         *         X position on the chart.
         *
         * @param  {number} y
         *         Y position on the chart.
         *
         * @param  {Dictionary} extra
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         */
        controller[type] = function (x, y, extra, debug) {
            triggerOnChart(typeLC, x, y, extra, debug);
        };
    });
    controller.setPositionToElement(chart.container);
    return controller;
};
