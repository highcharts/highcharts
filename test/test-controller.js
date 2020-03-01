/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/
/* *
 *
 *  Classes
 *
 * */
/**
 * The test controller makes it easy to emulate mouse and touch stuff on the
 * chart.
 *
 * @example
 * // Instanciate
 * var controller = new TestController(chart);
 *
 * // Simulate a panning operation
 * controller.pan([200, 100], [150, 100], { shiftKey: true });
 */
var TestController = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * The test controller makes it easy to emulate mouse and touch stuff on the
     * chart.
     *
     * @param chart
     * Chart to control
     */
    function TestController(chart) {
        if (!(this instanceof TestController)) {
            return new TestController(chart);
        }
        this.chart = chart;
        this.mouseEnterStack = [];
        this.positionX = 0;
        this.positionY = 0;
        this.relatedTarget = null;
        this.setPosition();
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Mock a TochList element with required internal methods.
     *
     * @param arr
     * The list of touches.
     */
    TestController.createTouchList = function (positions) {
        positions.item = function (i) {
            return this[i];
        };
        return positions;
    };
    /**
     * Returns all points between a movement.
     *
     * @param a
     * First point as [x, y] tuple.
     *
     * @param b
     * Second point as [x, y] tuple.
     *
     * @param interval
     * The distance between points.
     */
    TestController.getPointsBetween = function (a, b, interval) {
        if (interval === void 0) { interval = 1; }
        var points = [];
        var complete = false, x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1], deltaX, deltaY, distance, ratio, moveX, moveY;
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
            }
            else {
                points.push([b[0], b[1]]);
                complete = true;
            }
        }
        return points;
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Simulates a mouse click.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.click = function (chartX, chartY, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = void 0; }
        if (debug === void 0) { debug = false; }
        this.mouseDown(chartX, chartY, extra, debug);
        this.mouseUp(chartX, chartY, extra, debug);
        this.triggerEvent('click', chartX, chartY, extra, debug);
    };
    TestController.prototype.createEvent = function (type, chartX, chartY, extra) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = void 0; }
        var _a, _b;
        var chartOffset = Highcharts.offset(this.chart.container);
        var evt;
        if (document.createEvent) {
            evt = document.createEvent('Events');
            evt.initEvent(type, true, true);
        }
        else {
            evt = new Event(type, {
                bubbles: (_a = extra.bubbles, (_a !== null && _a !== void 0 ? _a : true)),
                cancelable: (_b = extra.cancelable, (_b !== null && _b !== void 0 ? _b : true))
            });
        }
        extra = (extra || {});
        extra.pageX = (chartOffset.left + chartX);
        extra.pageY = (chartOffset.top + chartY);
        switch (type) {
            case 'click':
            case 'dblclick':
            case 'mousedown':
            case 'mouseup':
                if (typeof extra.button === 'undefined') {
                    extra.button = TestController.MouseButtons.left;
                }
                break;
            case 'mouseenter':
            case 'mouseleave':
                extra.bubbles = false;
                extra.cancelable = false;
                break;
        }
        Object.keys(extra).forEach(function (key) {
            evt[key] = extra[key];
        });
        return evt;
    };
    /**
     * Get the element from a point on the chart.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     */
    TestController.prototype.elementFromPoint = function (chartX, chartY, useMSWorkaround) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (useMSWorkaround === void 0) { useMSWorkaround = true; }
        var chartOffset = Highcharts.offset(this.chart.container);
        var clipPaths;
        if (useMSWorkaround) {
            clipPaths = this.setUpMSWorkaround();
        }
        var element = document.elementFromPoint((chartOffset.left + chartX), (chartOffset.top + chartY));
        // Reset clip paths for Edge and IE
        if (clipPaths) {
            this.tearDownMSWorkaround(clipPaths);
        }
        return element;
    };
    TestController.prototype.elementsFromPoint = function (chartX, chartY, useMSWorkaround) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (useMSWorkaround === void 0) { useMSWorkaround = true; }
        var chartOffset = Highcharts.offset(this.chart.container);
        var clipPaths;
        if (useMSWorkaround) {
            clipPaths = this.setUpMSWorkaround();
        }
        var elements = document.elementsFromPoint((chartOffset.left + chartX), (chartOffset.top + chartY));
        // Reset clip paths for Edge and IE
        if (clipPaths) {
            this.tearDownMSWorkaround(clipPaths);
        }
        return elements;
    };
    /**
     * Get the current position of the cursor.
     */
    TestController.prototype.getPosition = function () {
        return {
            x: this.positionX,
            y: this.positionY,
            relatedTarget: this.relatedTarget
        };
    };
    /**
     * Triggers an event.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.mouseDown = function (chartX, chartY, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        this.triggerEvent('mousedown', chartX, chartY, extra, debug);
    };
    /**
     * Triggers mouse enter event on all necessary elements.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.mouseEnter = function (chartX, chartY, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        this.triggerEvent('mouseenter', chartX, chartY, extra, debug);
    };
    /**
     * Triggers mouse enter event on all necessary elements.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.mouseLeave = function (chartX, chartY, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        this.triggerEvent('mouseleave', chartX, chartY, extra, debug);
    };
    /**
     * Triggers an event.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.mouseMove = function (chartX, chartY, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        this.triggerEvent('mousemove', chartX, chartY, extra, debug);
    };
    /**
     * Triggers an event.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.mouseOut = function (chartX, chartY, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        this.triggerEvent('mouseout', chartX, chartY, extra, debug);
    };
    /**
     * Triggers an event.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.mouseOver = function (chartX, chartY, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        this.triggerEvent('mouseover', chartX, chartY, extra, debug);
    };
    /**
     * Triggers an event.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.mouseUp = function (chartX, chartY, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        this.triggerEvent('mouseup', chartX, chartY, extra, debug);
    };
    /**
     * Move the cursor from current position to a new one. Fire a series of
     * mousemoves, also mouseout and mouseover if new targets are found.
     *
     * @param chartX
     * New x position on the chart.
     *
     * @param chartY
     * New y position on the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.moveTo = function (chartX, chartY, extra, debug) {
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        var fromPosition = this.getPosition();
        var from = [fromPosition.x, fromPosition.y];
        var to = [chartX, chartY];
        var points = TestController.getPointsBetween(from, to);
        var currentTarget = fromPosition.relatedTarget, point, target, x1, y1;
        var clipPaths = this.setUpMSWorkaround();
        for (var i = 0, ie = points.length; i < ie; ++i) {
            point = points[i];
            x1 = point[0];
            y1 = point[1];
            target = this.elementFromPoint(x1, y1, false);
            if (!target) {
                continue;
            }
            if (target !== currentTarget) {
                // First trigger a mouseout on the old target.
                this.mouseOut(x1, y1, Highcharts.merge({
                    currentTarget: currentTarget,
                    relatedTarget: target,
                    target: target
                }, extra));
                this.mouseLeave(x1, y1, Highcharts.merge({
                    relatedTarget: target,
                    target: target
                }, extra));
            }
            this.mouseMove(x1, y1, extra, debug);
            if (target !== currentTarget) {
                // Then trigger a mouseover on the new target.
                this.mouseOver(x1, y1, Highcharts.merge({
                    relatedTarget: target,
                    target: target
                }, extra));
                this.mouseEnter(x1, y1, Highcharts.merge({
                    relatedTarget: target,
                    target: target
                }, extra));
                currentTarget = target;
            }
        }
        this.tearDownMSWorkaround(clipPaths);
        // Update controller positions and relatedTarget.
        this.setPosition(chartX, chartY);
    };
    /**
     * Simulates a mouse pan action between two points.
     *
     * @param startPoint
     * Starting point with x and y values relative to the chart.
     *
     * @param endPoint
     * Ending point with x any y values relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.pan = function (startPoint, endPoint, extra, debug) {
        if (startPoint === void 0) { startPoint = [this.positionX, this.positionY]; }
        if (endPoint === void 0) { endPoint = [this.positionX, this.positionY]; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        this.setPosition(startPoint[0], startPoint[1]);
        this.mouseDown(startPoint[0], startPoint[1], extra, debug);
        this.moveTo(endPoint[0], endPoint[1], extra, debug);
        this.mouseUp(endPoint[0], endPoint[1], extra, debug);
    };
    /**
     * Simulates a pinch gesture.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param distance
     * Distance between the two fingers. Negative values indicate, that the
     * fingers move to each other.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.pinch = function (chartX, chartY, distance, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (distance === void 0) { distance = 10; }
        if (debug === void 0) { debug = false; }
        var startPoint1, startPoint2, endPoint1, endPoint2;
        distance = Math.round(distance / 2);
        if (distance < 0) {
            distance = (-1 * distance);
            distance = (distance > 10 ? distance : 11);
            startPoint1 = [(chartX - distance), (chartY - distance)];
            startPoint2 = [(chartX + distance), (chartY + distance)];
            endPoint1 = [(chartX - 11), (chartY - 11)];
            endPoint2 = [(chartX + 11), (chartY + 11)];
        }
        else {
            distance = (distance > 10 ? distance : 11);
            startPoint1 = [(chartX - 11), (chartY - 11)];
            startPoint2 = [(chartX + 11), (chartY + 11)];
            endPoint1 = [(chartX - distance), (chartY - distance)];
            endPoint2 = [(chartX + distance), (chartY + distance)];
        }
        var movePoints1 = TestController.getPointsBetween(startPoint1, endPoint1, 1);
        var movePoints2 = TestController.getPointsBetween(startPoint2, endPoint2, 1);
        var target = this.elementFromPoint(chartX, chartY);
        var extra, movePoint1, movePoint2;
        for (var i = 0, ie = (movePoints1.length - 1); i <= ie; ++i) {
            movePoint1 = movePoints1[i];
            movePoint2 = movePoints2[i];
            extra = {
                relatedTarget: target,
                touches: TestController.createTouchList([
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
    };
    /**
     * Leave marks for debugging purposes.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     */
    TestController.prototype.setDebugMark = function (chartX, chartY, type) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (type === void 0) { type = TestController.DebugMarkTypes.normal; }
        var marker = this.chart.renderer
            .circle(chartX, chartY, (type === TestController.DebugMarkTypes.movement ? 2 : 3))
            .attr({
            fill: 'white',
            stroke: (type === TestController.DebugMarkTypes.movement ?
                'blue' :
                type === TestController.DebugMarkTypes.activation ?
                    'green' :
                    'red'),
            'stroke-width': (type === TestController.DebugMarkTypes.movement ? 1 : 2),
            zIndex: 100
        });
        return marker
            .css({
            'pointer-events': 'none'
        })
            .add();
    };
    /**
     * Move the cursor position to a new position, without firing events.
     *
     * @param chartX
     * New x position on the chart.
     *
     * @param chartY
     * New y position on the chart.
     */
    TestController.prototype.setPosition = function (chartX, chartY) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        this.positionX = chartX;
        this.positionY = chartY;
        this.relatedTarget = this.elementFromPoint(chartX, chartY);
    };
    /**
     * Edge and IE are unable to get elementFromPoint when the group has a
     * clip path. It reports the first underlying element with no clip path.
     */
    TestController.prototype.setUpMSWorkaround = function () {
        var clipPaths = {
            elements: [],
            values: []
        };
        if (/(Trident|Edge)/.test(window.navigator.userAgent)) {
            [].slice
                .call(document.querySelectorAll('[clip-path],[CLIP-PATH]'))
                .forEach(function (elemCP) {
                clipPaths.elements.push(elemCP);
                clipPaths.values.push(elemCP.getAttribute('clip-path'));
                elemCP.removeAttribute('clip-path');
            });
        }
        return clipPaths;
    };
    /**
     * Simulates a slide gesture between two points.
     *
     * @param startPoint
     * Starting point on the chart with x and y value.
     *
     * @param endPoint
     * Ending point on the chart with x any y value.
     *
     * @param twoFingers
     * Whether to use one or two fingers for the gesture.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.slide = function (startPoint, endPoint, twoFingers, debug) {
        if (startPoint === void 0) { startPoint = [this.positionX, this.positionY]; }
        if (endPoint === void 0) { endPoint = [this.positionX, this.positionY]; }
        if (twoFingers === void 0) { twoFingers = false; }
        if (debug === void 0) { debug = false; }
        var movePoints = TestController
            .getPointsBetween(startPoint, endPoint);
        this.touchStart(startPoint[0], startPoint[1], twoFingers, undefined, debug);
        var movePoint;
        for (var i = 0, ie = movePoints.length; i < ie; ++i) {
            movePoint = movePoints[i];
            this.touchMove(movePoint[0], movePoint[1], twoFingers, undefined, debug);
        }
        this.touchEnd(endPoint[0], endPoint[1], twoFingers, undefined, debug);
    };
    /**
     * Simulates a tap action with a finger.
     *
     * @param chartX
     * X position to tab on.
     *
     * @param chartY
     * Y position to tab on.
     *
     * @param twoFingers
     * Whether to use one or two fingers for the gesture.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.tap = function (chartX, chartY, twoFingers, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (twoFingers === void 0) { twoFingers = false; }
        if (debug === void 0) { debug = false; }
        this.touchStart(chartX, chartY, twoFingers, undefined, debug);
        this.touchEnd(chartX, chartY, twoFingers, undefined, debug);
    };
    /**
     * Undo the workaround for Edge and IE.
     *
     * @param clipPaths
     * The clip paths that were returned from the `setUpMSWorkaround` function.
     */
    TestController.prototype.tearDownMSWorkaround = function (clipPaths) {
        // Reset clip paths for Edge and IE
        if (clipPaths) {
            clipPaths.elements.forEach(function (elemCP, i) {
                elemCP.setAttribute('clip-path', clipPaths.values[i]);
            });
        }
    };
    /**
     * Triggers touch ends events.
     *
     * @param chartX
     * X position on the chart.
     *
     * @param chartY
     * Y position on the chart.
     *
     * @param twoFingers
     * Whether to use one or two fingers for the gesture.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.touchEnd = function (chartX, chartY, twoFingers, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (twoFingers === void 0) { twoFingers = false; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        var target = (this.elementFromPoint(chartX, chartY) || undefined);
        extra = (extra || {});
        extra.preventDefault = (extra.preventDefault || function () { });
        extra.relatedTarget = (extra.relatedTarget || target);
        if (twoFingers === true) {
            extra.touches = (extra.touches ||
                TestController.createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ]));
        }
        else {
            extra.touches = (extra.touches ||
                TestController.createTouchList([
                    { pageX: chartX, pageY: chartY }
                ]));
        }
        this.triggerEvent('touchend', chartX, chartY, extra, debug);
        if (Highcharts.Pointer) {
            this.triggerEvent('pointerup', chartX, chartY, extra, debug);
        }
        else if (Highcharts.MSPointer) {
            this.triggerEvent('MSPointerUp', chartX, chartY, extra, debug);
        }
    };
    /**
     * Triggers touch move events.
     *
     * @param chartX
     * X position on the chart.
     *
     * @param chartY
     * Y position on the chart.
     *
     * @param twoFingers
     * Whether to use one or two fingers for the gesture.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.touchMove = function (chartX, chartY, twoFingers, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (twoFingers === void 0) { twoFingers = false; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        var target = this.elementFromPoint(chartX, chartY);
        extra = (extra || {});
        extra.preventDefault = (extra.preventDefault || function () { });
        extra.relatedTarget = (extra.relatedTarget || target);
        if (twoFingers === true) {
            extra.touches = (extra.touches ||
                TestController.createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ]));
        }
        else {
            extra.touches = (extra.touches ||
                TestController.createTouchList([
                    { pageX: chartX, pageY: chartY }
                ]));
        }
        if (Highcharts.Pointer) {
            this.triggerEvent('pointermove', chartX, chartY, extra, debug);
        }
        else if (Highcharts.MSPointer) {
            this.triggerEvent('MSPointerMove', chartX, chartY, extra, debug);
        }
        this.triggerEvent('touchmove', chartX, chartY, extra, debug);
    };
    /**
     * Triggers touch starts events.
     *
     * @param chartX
     * X position on the chart.
     *
     * @param chartY
     * Y position on the chart.
     *
     * @param twoFingers
     * Whether to use one or two fingers for the gesture.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.touchStart = function (chartX, chartY, twoFingers, extra, debug) {
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (twoFingers === void 0) { twoFingers = false; }
        if (extra === void 0) { extra = undefined; }
        if (debug === void 0) { debug = false; }
        var target = this.elementFromPoint(chartX, chartY);
        extra = (extra || {});
        extra.preventDefault = (extra.preventDefault || function () { });
        extra.relatedTarget = (extra.relatedTarget || target);
        if (twoFingers === true) {
            extra.touches = (extra.touches ||
                TestController.createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ]));
        }
        else {
            extra.touches = (extra.touches ||
                TestController.createTouchList([
                    { pageX: chartX, pageY: chartY }
                ]));
        }
        this.triggerEvent('touchstart', chartX, chartY, extra, debug);
        if (Highcharts.Pointer) {
            this.triggerEvent('pointerdown', chartX, chartY, extra, debug);
        }
        else if (Highcharts.MSPointer) {
            this.triggerEvent('MSPointerDown', chartX, chartY, extra, debug);
        }
    };
    /**
     * Trigger an event. The target element will be found based on the chart
     * coordinates. This function is called behind the shorthand functions
     * like .click() and .mousemove().
     *
     * @param type
     * Event type.
     *
     * @param chartX
     * X relative to the chart.
     *
     * @param chartY
     * Y relative to the chart.
     *
     * @param extra
     * Extra properties for the event arguments, for example
     * `{ shiftKey: true }` to emulate that the shift key has been pressed in a
     * mouse event.
     *
     * @param debug
     * Add marks where the event was triggered. Should not be enabled in
     * production, as it slows down the test and also leaves an element that
     * might catch events and mess up the test result.
     */
    TestController.prototype.triggerEvent = function (type, chartX, chartY, extra, debug) {
        var _a;
        var _this = this;
        if (chartX === void 0) { chartX = this.positionX; }
        if (chartY === void 0) { chartY = this.positionY; }
        if (extra === void 0) { extra = {}; }
        if (debug === void 0) { debug = false; }
        // Find an element related to the coordinates and fire event.
        var element = ((extra && extra.currentTarget) ||
            (extra && extra.target) ||
            this.elementFromPoint(chartX, chartY));
        if (!element) {
            return;
        }
        // Leave marks for debugging
        if (debug) {
            this.setDebugMark(chartX, chartY, type === 'mousemove' ?
                TestController.DebugMarkTypes.movement :
                type === 'mousedown' ?
                    TestController.DebugMarkTypes.activation :
                    TestController.DebugMarkTypes.normal);
        }
        if (typeof extra.currentTarget === 'undefined') {
            extra.currentTarget = element;
        }
        if (typeof extra.target === 'undefined') {
            extra.target = element;
        }
        var evt = this.createEvent(type, chartX, chartY, extra);
        switch (type) {
            default:
                element.dispatchEvent(evt);
                break;
            case 'mouseleave':
            case 'mouseenter':
                var elements = this.elementsFromPoint(chartX, chartY);
                var mouseEnterStack_1 = this.mouseEnterStack;
                if (type === 'mouseleave') {
                    this.mouseEnterStack = elements.filter(function (element) {
                        if (mouseEnterStack_1.indexOf(element)) {
                            return true;
                        }
                        extra.currentTarget = element;
                        evt = _this.createEvent(type, chartX, chartY, extra);
                        element.dispatchEvent(evt);
                        return false;
                    });
                }
                else {
                    (_a = this.mouseEnterStack).unshift.apply(_a, elements.filter(function (element) {
                        if (mouseEnterStack_1.indexOf(element)) {
                            return false;
                        }
                        extra.currentTarget = element;
                        evt = _this.createEvent(type, chartX, chartY, extra);
                        element.dispatchEvent(evt);
                        return true;
                    }));
                }
                break;
        }
    };
    return TestController;
}());
(function (TestController) {
    /* *
     *
     *  Enums
     *
     * */
    var DebugMarkTypes;
    (function (DebugMarkTypes) {
        DebugMarkTypes[DebugMarkTypes["activation"] = 0] = "activation";
        DebugMarkTypes[DebugMarkTypes["movement"] = 1] = "movement";
        DebugMarkTypes[DebugMarkTypes["normal"] = 2] = "normal";
    })(DebugMarkTypes = TestController.DebugMarkTypes || (TestController.DebugMarkTypes = {}));
    var MouseButtons;
    (function (MouseButtons) {
        MouseButtons[MouseButtons["left"] = 0] = "left";
        MouseButtons[MouseButtons["middle"] = 1] = "middle";
        MouseButtons[MouseButtons["right"] = 2] = "right";
    })(MouseButtons = TestController.MouseButtons || (TestController.MouseButtons = {}));
})(TestController || (TestController = {}));
