/* eslint valid-jsdoc: 0 */
/* global Highcharts, document, window */
/**
 * The test controller makes it easy to emulate mouse and touch stuff on the
 * chart.
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
     *         The list of touches.
     *
     * @return {Array}
     *         Array of touches including required internal methods.
     */
    function createTouchList(arr) {
        arr.item = function (i) {
            return this[i];
        };
        return arr;
    }

    /**
     * Get the element from a point on the chart.
     *
     * @param  {number} chartX
     *         X relative to the chart.
     *
     * @param  {number} chartY
     *         Y relative to the chart.
     *
     * @return {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement}
     *         HTML or SVG DOM element.
     */
    function elementFromPoint(chartX, chartY) {

        var chartOffset = Highcharts.offset(chart.container),
            element,
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

        element = document.elementFromPoint(
            (chartOffset.left + chartX),
            (chartOffset.top + chartY)
        );

        // Reset clip paths for Edge and IE
        clipPaths.elements.forEach(function (elemCP, i) {
            elemCP.setAttribute('clip-path', clipPaths.values[i]);
        });

        return element;
    }

    /**
     * Returns all points between a movement.
     *
     * @param  {Array<number>} a
     *         First point as [x, y].
     *
     * @param  {Array<number>} b
     *         Second point as [x, y].

     * @param  {number} interval
     *         The distance between points.
     *
     * @return {Array<Array<number>>}
     *         Array of points as [x, y].
     */
    function getPointsBetween(a, b, interval) {

        var points = [],
            complete = false,
            x1 = a[0],
            y1 = a[1],
            x2 = b[0],
            y2 = b[1],
            deltaX,
            deltaY,
            distance,
            ratio,
            moveX,
            moveY;

        points.push([x1, y1]);

        while (!complete) {

            deltaX = x2 - x1;
            deltaY = y2 - y1;
            distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

            if (distance > interval) {
                ratio = interval / distance;
                moveX = ratio * deltaX;
                moveY = ratio * deltaY;
                x1 += moveX;
                y1 += moveY;
                points.push([x1, y1]);
            } else {
                points.push([b[0], b[1]]);
                complete = true;
            }
        }

        return points;
    }


    controller = {
        positionX: null,
        positionY: null,
        relatedTarget: null,
        /**
         * Move the cursor position to a new position, without fire events.
         *
         * @param  {number} chartX
         *         New x position on the chart.
         *
         * @param  {number} chartY
         *         New y position on the chart.
         *
         * @return {void}
         *         Pure setter.
         */
        setPosition: function (chartX, chartY) {
            this.positionX = chartX;
            this.positionY = chartY;
            this.relatedTarget = elementFromPoint(chartX, chartY);
        },
        /**
         * Get the current position of the cursor.
         *
         * @return {Dictionary}
         *         Object containing x, y and relatedTarget.
         */
        getPosition: function () {
            return {
                x: this.positionX,
                y: this.positionY,
                relatedTarget: this.relatedTarget
            };
        },
        /**
         * Move the cursor from current position to a new one. Fire a series of
         * mousemoves, also mouseout and mouseover if new targets are found.
         *
         * @param  {number} chartX
         *         New x position on the chart.
         *
         * @param  {number} chartY
         *         New y position on the chart.
         *
         * @param  {Dictionary|undefined} [extra]
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         *
         * @return {void}
         */
        moveTo: function (chartX, chartY, extra, debug) {

            var self = this,
                fromPosition = self.getPosition(),
                from = [ fromPosition.x, fromPosition.y ],
                to = [ chartX, chartY ],
                interval = 1,
                relatedTarget = fromPosition.relatedTarget,
                points = getPointsBetween(from, to, interval);

            Highcharts.each(points, function (p) {

                var x1 = p[0],
                    y1 = p[1],
                    target = elementFromPoint(x1, y1);

                if (target !== relatedTarget) {
                    // First trigger a mouseout on the old target.
                    self.triggerEvent(
                        'mouseout',
                        x1, y1,
                        Highcharts.merge({
                            currentTarget: relatedTarget,
                            relatedTarget: target
                        }, extra),
                        debug
                    );
                }

                self.triggerEvent('mousemove', x1, y1, extra, debug);

                if (target !== relatedTarget) {
                    // Then trigger a mouseover on the new target.
                    if (target) {
                        self.triggerEvent(
                            'mouseover',
                            x1, y1,
                            Highcharts.merge({
                                relatedTarget: target
                            }, extra),
                            debug
                        );
                    }
                    relatedTarget = target;
                }
            });

            // Update controller positions and relatedTarget.
            self.setPosition(chartX, chartY);
        },
        /**
         * Simulates a mouse click.
         *
         * @param  {number|undefined} [chartX]
         *         X position on the chart.
         *
         * @param  {number|undefined} [chartY]
         *         Y position on the chart.
         *
         * @param  {Dictionary|undefined} [extra]
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @param  {boolean|undefined} [debug]
         *         Draw a position circle for debugging purposes.
         *
         * @return {void}
         */
        click: function (chartX, chartY, extra, debug) {

            chartX = (chartX || this.positionX);
            chartY = (chartY || this.positionY);

            this.mouseDown(chartX, chartY, extra, debug);
            this.mouseUp(chartX, chartY, extra, debug);
            this.triggerEvent('click', chartX, chartY, extra, debug);
        },
        /**
         * Simulates a mouse pan action between two points.
         *
         * @param  {Array<number>} [startPoint]
         *         Starting point with x and y values relative to the chart.
         *
         * @param  {Array<number>} [endPoint]
         *         Ending point with x any y values relative to the chart.
         *
         * @param  {Dictionary|undefined} [extra]
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         *
         * @return {void}
         */
        pan: function (startPoint, endPoint, extra, debug) {
            this.setPosition(startPoint[0], startPoint[1]);
            this.mouseDown(startPoint[0], startPoint[1], extra, debug);
            this.moveTo(endPoint[0], endPoint[1], extra, debug);
            this.mouseUp(endPoint[0], endPoint[1], extra, debug);
        },

        /**
         * Simulates a pinch gesture.
         *
         * @param  {number} chartX
         *         X position on the chart.
         *
         * @param  {number} chartY
         *         Y position on the chart.
         *
         * @param  {number} distance
         *         Distance between the two fingers. Negative values indicate,
         *         that the fingers move to each other.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         *
         * @return {void}
         */
        pinch: function (chartX, chartY, distance, debug) {

            var startPoint1,
                startPoint2,
                endPoint1,
                endPoint2;

            distance = Math.round(distance / 2);

            if (distance < 0) {
                distance = (-1 * distance);
                distance = (distance > 10 ? distance : 11);
                startPoint1 = [(chartX - distance), (chartY - distance)];
                startPoint2 = [(chartX + distance), (chartY + distance)];
                endPoint1 = [(chartX - 11), (chartY - 11)];
                endPoint2 = [(chartX + 11), (chartY + 11)];
            } else {
                distance = (distance > 10 ? distance : 11);
                startPoint1 = [(chartX - 11), (chartY - 11)];
                startPoint2 = [(chartX + 11), (chartY + 11)];
                endPoint1 = [(chartX - distance), (chartY - distance)];
                endPoint2 = [(chartX + distance), (chartY + distance)];
            }

            var extra,
                movePoint1,
                movePoints1 = getPointsBetween(startPoint1, endPoint1, 1),
                movePoint2,
                movePoints2 = getPointsBetween(startPoint2, endPoint2, 1),
                target = elementFromPoint(chartX, chartY);

            for (var i = 0, ie = (movePoints1.length - 1); i <= ie; ++i) {

                movePoint1 = movePoints1[i];
                movePoint2 = movePoints2[i];
                extra = {
                    relatedTarget: target,
                    touches: createTouchList([
                        { pageX: movePoint1[0], pageY: movePoint1[1] },
                        { pageX: movePoint2[0], pageY: movePoint2[1] }
                    ])
                };

                if (i === 0) {
                    this.touchStart(chartX, chartY, undefined, extra, debug);
                }

                this.touchMove(chartX, chartY, undefined, extra, debug);

                if (i === ie) {
                    this.touchEnd(chartX, chartY, undefined, extra, debug);
                }
            }
        },
        /**
         * Simulates a slide gesture between two points.
         *
         * @param  {Array<number>} startPoint
         *         Starting point on the chart with x and y value.
         *
         * @param  {Array<number>} endPoint
         *         Ending point on the chart with x any y value.
         *
         * @param  {boolean|undefined} [twoFingers]
         *         Whether to use one or two fingers for the gesture.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         *
         * @return {void}
         */
        slide: function (startPoint, endPoint, twoFingers, debug) {

            var interval = 1,
                movePoint,
                movePoints = getPointsBetween(startPoint, endPoint, interval);

            this.touchStart(
                startPoint[0], startPoint[1], twoFingers, undefined, debug
            );

            for (var i = 0, ie = movePoints.length; i < ie; ++i) {
                movePoint = movePoints[i];
                this.touchMove(
                    movePoint[0], movePoint[1], twoFingers, undefined, debug
                );
            }

            this.touchEnd(
                endPoint[0], endPoint[1], twoFingers, undefined, debug
            );
        },
        /**
         * Simulates a tab action with a finger.
         *
         * @param  {number} chartX
         *         X position to tab on.
         *
         * @param  {number} chartY
         *         Y position to tab on.
         *
         * @param  {boolean|undefined} [twoFingers]
         *         Whether to use one or two fingers for the gesture.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         *
         * @return {void}
         */
        tap: function (chartX, chartY, twoFingers, debug) {
            this.touchStart(chartX, chartY, twoFingers, undefined, debug);
            this.touchEnd(chartX, chartY, twoFingers, undefined, debug);
        },
        /**
         * Triggers touch ends events.
         *
         * @param  {number} chartX
         *         X position on the chart.
         *
         * @param  {number} chartY
         *         Y position on the chart.
         *
         * @param  {boolean|undefined} [twoFingers]
         *         Whether to use one or two fingers for the gesture.
         *
         * @param  {Dictionary|undefined} [extra]
         *         Extra properties for the event arguments.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         *
         * @return {void}
         */
        touchEnd: function (chartX, chartY, twoFingers, extra, debug) {

            var target = elementFromPoint(chartX, chartY);

            extra = (extra || {});
            extra.preventDefault = (extra.preventDefault || function () {});
            extra.relatedTarget = (extra.relatedTarget || target);

            if (twoFingers === true) {
                extra.touches = (extra.touches || createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ]));
            } else {
                extra.touches = (extra.touches || createTouchList([
                    { pageX: chartX, pageY: chartY }
                ]));
            }

            this.triggerEvent('touchend', chartX, chartY, extra, debug);
            if (Pointer) {
                this.triggerEvent('pointerup', chartX, chartY, extra, target);
            } else if (MSPointer) {
                this.triggerEvent('MSPointerUp', chartX, chartY, extra, target);
            }
        },
        /**
         * Triggers touch move events.
         *
         * @param  {number} chartX
         *         X position on the chart.
         *
         * @param  {number} chartY
         *         Y position on the chart.
         *
         * @param  {boolean|undefined} [twoFingers]
         *         Whether to use one or two fingers for the gesture.
         *
         * @param  {Dictionary|undefined} [extra]
         *         Extra properties for the event arguments.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         *
         * @return {void}
         */
        touchMove: function (chartX, chartY, twoFingers, extra, debug) {

            var target = elementFromPoint(chartX, chartY);

            extra = (extra || {});
            extra.preventDefault = (extra.preventDefault || function () {});
            extra.relatedTarget = (extra.relatedTarget || target);

            if (twoFingers === true) {
                extra.touches = (extra.touches || createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ]));
            } else {
                extra.touches = (extra.touches || createTouchList([
                    { pageX: chartX, pageY: chartY }
                ]));
            }

            if (Pointer) {
                this.triggerEvent('pointermove', chartX, chartY, extra, debug);
            } else if (MSPointer) {
                this.triggerEvent('MSPointerMove', chartX, chartY, extra, debug);
            }
            this.triggerEvent('touchmove', chartX, chartY, extra, debug);
        },
        /**
         * Triggers touch starts events.
         *
         * @param  {number} chartX
         *         X position on the chart.
         *
         * @param  {number} chartY
         *         Y position on the chart.
         *
         * @param  {boolean|undefined} [twoFingers]
         *         Whether to use one or two fingers for the gesture.
         *
         * @param  {Dictionary|undefined} [extra]
         *         Extra properties for the event arguments.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be
         *         enabled in production, as it slows down the test and also
         *         leaves an element that might catch events and mess up the
         *         test result.
         *
         * @return {void}
         */
        touchStart: function (chartX, chartY, twoFingers, extra, debug) {

            var target = elementFromPoint(chartX, chartY);

            extra = (extra || {});
            extra.preventDefault = (extra.preventDefault || function () {});
            extra.relatedTarget = (extra.relatedTarget || target);

            if (twoFingers === true) {
                extra.touches = (extra.touches || createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ]));
            } else {
                extra.touches = (extra.touches || createTouchList([
                    { pageX: chartX, pageY: chartY }
                ]));
            }

            this.triggerEvent('touchstart', chartX, chartY, extra, debug);
            if (Pointer) {
                this.triggerEvent('pointerdown', chartX, chartY, extra, debug);
            } else if (MSPointer) {
                this.triggerEvent('MSPointerDown', chartX, chartY, extra, debug);
            }
        },
        /**
         * Trigger an event. The target element will be found based on the chart
         * coordinates. This function is called behind the shorthand functions like
         * .click() and .mousemove().
         *
         * @param  {string} type
         *         Event type.
         *
         * @param  {number|undefined} [chartX]
         *         X relative to the chart.
         *
         * @param  {number|undefined} [chartY]
         *         Y relative to the chart.
         *
         * @param  {Dictionary|undefined} [extra]
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @param  {boolean|undefined} [debug]
         *         Add marks where the event was triggered. Should not be enabled in
         *         production, as it slows down the test and also leaves an element
         *         that might catch events and mess up the test result.
         *
         * @return {void}
         */
        triggerEvent: function (type, chartX, chartY, extra, debug) {

            chartX = (chartX || 0);
            chartY = (chartY || 0);

            var chartOffset = Highcharts.offset(chart.container),
                element,
                evt = document.createEvent('Events');

            evt.initEvent(type, true, true);
            evt.pageX = (chartOffset.left + chartX);
            evt.pageY = (chartOffset.top + chartY);

            if (extra) {
                Object.keys(extra).forEach(function (key) {
                    evt[key] = extra[key];
                });
            }

            // Leave marks for debugging
            if (debug &&
                typeof evt.pageX === 'number' &&
                typeof evt.pageY === 'number'
            ) {
                chart.renderer.circle(
                    chartX,
                    chartY,
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

            // Find an element related to the coordinates and fire event.
            element = (
                (extra && extra.currentTarget) ||
                elementFromPoint(chartX, chartY)
            );
            if (element) {
                element.dispatchEvent(evt);
            }
        }
    };
    // Shorthand functions. Calls trigger, except the type.
    [
        'mouseDown',
        'mouseMove',
        'mouseUp',
        'mouseOut',
        'mouseOver'
    ].forEach(function (type) {
        var typeLC = type.toLowerCase();
        /**
         * Triggers an event.
         *
         * @param  {number|undefined} [chartX]
         *         X position on the chart.
         *
         * @param  {number|undefined} [chartY]
         *         Y position on the chart.
         *
         * @param  {Dictionary|undefined} [extra]
         *         Extra properties for the event arguments, for example
         *         `{ shiftKey: true }` to emulate that the shift key has been
         *         pressed in a mouse event.
         *
         * @param  {boolean|undefined} [debug]
         *         Draw a position circle for debugging purposes.
         *
         * @return {void}
         */
        controller[type] = function (chartX, chartY, extra, debug) {
            controller.triggerEvent(
                typeLC,
                (chartX || controller.positionX),
                (chartY || controller.positionY),
                extra,
                debug
            );
        };
    });
    controller.setPosition(0, 0);
    return controller;
};
