/* *
 *
 *  Types
 *
 * */

type HighchartsElement = (
    Highcharts.HTMLDOMElement |
    Highcharts.SVGDOMElement
);

/**
 * Contains x and y position relative to the chart.
 */
type TestControllerPoint = [number, number];

/* *
 *
 *  Interfaces
 *
 * */

interface TestControllerPosition extends Highcharts.PositionObject {
    relatedTarget: (HighchartsElement | null);
}

interface TestControllerTouchPosition {
    pageX: number;
    pageY: number;
}

interface TestControllerTouchPositions
    extends Array<TestControllerTouchPosition>
{
    [index: number]: TestControllerTouchPosition;
    item?: (index: number) => TestControllerTouchPosition;
}

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
class TestController {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Mock a TochList element with required internal methods.
     *
     * @param arr
     *        The list of touches.
     */
    private static createTouchList (
        array: TestControllerTouchPositions
    ): TestControllerTouchPositions {
        array.item = function (this: TestControllerTouchPositions, i: number) {
            console.log(typeof this, Object.keys(this));
            return this[i];
        };
        return array;
    }

    /**
     * Returns all points between a movement.
     *
     * @param a
     *        First point as [x, y] tuple.
     *
     * @param b
     *        Second point as [x, y] tuple.
     *
     * @param interval
     *        The distance between points.
     */
    private static getPointsBetween(
        a: TestControllerPoint, b: TestControllerPoint, interval: number
    ): Array<TestControllerPoint> {

        const points = [] as Array<TestControllerPoint>;

        let complete = false,
            x1 = a[0],
            y1 = a[1],
            x2 = b[0],
            y2 = b[1],
            deltaX: number,
            deltaY: number,
            distance: number,
            ratio: number,
            moveX: number,
            moveY: number;

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
     *        Chart to control
     */
    constructor (chart: Highcharts.Chart) {

        this.chart = chart;
        this.positionX = 0;
        this.positionY = 0;
        this.relatedTarget = null;
        this.setPosition();
    }

    /* *
     *
     *  Properties
     *
     * */

    private chart: Highcharts.Chart;

    private positionX: number;
    
    private positionY: number;

    private relatedTarget: (HighchartsElement | null);

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Simulates a mouse click.
     *
     * @param chartX
     *        X position on the chart.
     *
     * @param chartY
     *        Y position on the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Draw a position circle for debugging purposes.
     */
    public click (
        chartX?: number, chartY?: number, extra?: any, debug?: boolean
    ) {

        chartX = (chartX || this.positionX);
        chartY = (chartY || this.positionY);

        this.mouseDown(chartX, chartY, extra, debug);
        this.mouseUp(chartX, chartY, extra, debug);
        this.triggerEvent('click', chartX, chartY, extra, debug);
    }

    /**
     * Get the element from a point on the chart.
     *
     * @param chartX
     *        X relative to the chart.
     *
     * @param chartY
     *        Y relative to the chart.
     */
    public elementFromPoint (
        chartX: number, chartY: number
    ): (HighchartsElement | null) {

        let chartOffset = Highcharts.offset(this.chart.container),
            clipPaths = {
                elements: [] as Array<HighchartsElement>,
                values: [] as Array<string>
            };

        // Edge and IE are unable to get elementFromPoint when the group has a
        // clip path. It reports the first underlying element with no clip path.
        if (/(Trident|Edge)/.test(window.navigator.userAgent)) {
            [].slice
                .call(document.querySelectorAll('[clip-path],[CLIP-PATH]'))
                .forEach(
                    function (elemCP: HighchartsElement) {
                        clipPaths.elements.push(elemCP);
                        clipPaths.values.push(
                            elemCP.getAttribute('clip-path')!
                        );
                        elemCP.removeAttribute('clip-path');
                    }
                );
        }

        let element = document.elementFromPoint(
            (chartOffset.left + chartX),
            (chartOffset.top + chartY)
        ) as HighchartsElement;

        // Reset clip paths for Edge and IE
        clipPaths.elements.forEach(function (elemCP, i) {
            elemCP.setAttribute('clip-path', clipPaths.values[i]);
        });

        return element;
    }

    /**
     * Get the current position of the cursor.
     */
    public getPosition (): TestControllerPosition {
        return {
            x: this.positionX,
            y: this.positionY,
            relatedTarget: this.relatedTarget
        };
    }

    /**
     * Move the cursor from current position to a new one. Fire a series of
     * mousemoves, also mouseout and mouseover if new targets are found.
     *
     * @param chartX
     *        New x position on the chart.
     *
     * @param chartY
     *        New y position on the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public moveTo (
        chartX: number, chartY: number, extra?: any, debug?: boolean
    ) {

        var self = this,
            fromPosition = self.getPosition(),
            from = [fromPosition.x, fromPosition.y] as TestControllerPoint,
            to = [chartX, chartY] as TestControllerPoint,
            interval = 1,
            relatedTarget = fromPosition.relatedTarget,
            points = TestController.getPointsBetween(from, to, interval);

        Highcharts.each(points, function (p?: TestControllerPoint) {

            if (!p) {
                return;
            }

            let x1 = p[0],
                y1 = p[1],
                target = self.elementFromPoint(x1, y1);

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
    }

    /**
     * Simulates a mouse pan action between two points.
     *
     * @param startPoint
     *        Starting point with x and y values relative to the chart.
     *
     * @param endPoint
     *        Ending point with x any y values relative to the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public pan (
        startPoint?: TestControllerPoint,
        endPoint?: TestControllerPoint,
        extra?: any,
        debug?: boolean
    ) {

        startPoint = (startPoint || [this.positionX, this.positionY]);
        endPoint = (endPoint || [this.positionX, this.positionY]);

        this.setPosition(startPoint[0], startPoint[1]);
        this.mouseDown(startPoint[0], startPoint[1], extra, debug);
        this.moveTo(endPoint[0], endPoint[1], extra, debug);
        this.mouseUp(endPoint[0], endPoint[1], extra, debug);
    }

    /**
     * Simulates a pinch gesture.
     *
     * @param chartX
     *        X position on the chart.
     *
     * @param chartY
     *        Y position on the chart.
     *
     * @param distance
     *        Distance between the two fingers. Negative values indicate,
     *        that the fingers move to each other.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public pinch (
        chartX: number, chartY: number, distance: number, debug?: boolean
    ) {

        var startPoint1: [number, number],
            startPoint2: [number, number],
            endPoint1: [number, number],
            endPoint2: [number, number];

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
            movePoints1 = TestController.getPointsBetween(
                startPoint1, endPoint1, 1
            ),
            movePoint2,
            movePoints2 = TestController.getPointsBetween(
                startPoint2, endPoint2, 1
            ),
            target = this.elementFromPoint(chartX, chartY);

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
    }

    /**
     * Move the cursor position to a new position, without firing events.
     *
     * @param chartX
     *        New x position on the chart.
     *
     * @param chartY
     *        New y position on the chart.
     */
    public setPosition (chartX?: number, chartY?: number) {
        this.positionX = (chartX || this.positionY);
        this.positionY = (chartY || this.positionY);
        this.relatedTarget = this.elementFromPoint(
            this.positionX, this.positionY
        );
    }


    /**
     * Simulates a slide gesture between two points.
     *
     * @param startPoint
     *        Starting point on the chart with x and y value.
     *
     * @param endPoint
     *        Ending point on the chart with x any y value.
     *
     * @param twoFingers
     *        Whether to use one or two fingers for the gesture.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     *
     * @return {void}
     */
    public slide (
        startPoint: TestControllerPoint,
        endPoint: TestControllerPoint,
        twoFingers?: boolean,
        debug?: boolean
    ) {

        var interval = 1,
            movePoint,
            movePoints = TestController.getPointsBetween(
                startPoint, endPoint, interval
            );

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
    }

    /**
     * Simulates a tap action with a finger.
     *
     * @param chartX
     *        X position to tab on.
     *
     * @param chartY
     *        Y position to tab on.
     *
     * @param twoFingers
     *        Whether to use one or two fingers for the gesture.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public tap (
        chartX: number,
        chartY: number,
        twoFingers?: boolean,
        debug?: boolean
    ) {
        this.touchStart(chartX, chartY, twoFingers, undefined, debug);
        this.touchEnd(chartX, chartY, twoFingers, undefined, debug);
    }

    /**
     * Triggers touch ends events.
     *
     * @param chartX
     *        X position on the chart.
     *
     * @param chartY
     *        Y position on the chart.
     *
     * @param twoFingers
     *        Whether to use one or two fingers for the gesture.
     *
     * @param extra
     *        Extra properties for the event arguments.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public touchEnd (
        chartX: number,
        chartY: number,
        twoFingers?: boolean,
        extra?: any,
        debug?: boolean
    ) {

        const target = (this.elementFromPoint(chartX, chartY) || undefined);

        extra = (extra || {});
        extra.preventDefault = (extra.preventDefault || function () {});
        extra.relatedTarget = (extra.relatedTarget || target);

        if (twoFingers === true) {
            extra.touches = (
                extra.touches ||
                TestController.createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ])
            );
        } else {
            extra.touches = (
                extra.touches ||
                TestController.createTouchList([
                    { pageX: chartX, pageY: chartY }
                ])
            );
        }

        this.triggerEvent('touchend', chartX, chartY, extra, debug);
        if ((window as any).Pointer) {
            this.triggerEvent('pointerup', chartX, chartY, extra, debug);
        } else if ((window as any).MSPointer) {
            this.triggerEvent('MSPointerUp', chartX, chartY, extra, debug);
        }
    }

    /**
     * Triggers touch move events.
     *
     * @param chartX
     *        X position on the chart.
     *
     * @param chartY
     *        Y position on the chart.
     *
     * @param twoFingers
     *        Whether to use one or two fingers for the gesture.
     *
     * @param extra
     *        Extra properties for the event arguments.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public touchMove (
        chartX: number,
        chartY: number,
        twoFingers?: boolean,
        extra?: any,
        debug?: boolean
    ) {

        const target = this.elementFromPoint(chartX, chartY);

        extra = (extra || {});
        extra.preventDefault = (extra.preventDefault || function () {});
        extra.relatedTarget = (extra.relatedTarget || target);

        if (twoFingers === true) {
            extra.touches = (
                extra.touches ||
                TestController.createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ])
            );
        } else {
            extra.touches = (
                extra.touches ||
                TestController.createTouchList([
                    { pageX: chartX, pageY: chartY }
                ])
            );
        }

        if ((window as any).Pointer) {
            this.triggerEvent('pointermove', chartX, chartY, extra, debug);
        } else if ((window as any).MSPointer) {
            this.triggerEvent(
                'MSPointerMove', chartX, chartY, extra, debug
            );
        }
        this.triggerEvent('touchmove', chartX, chartY, extra, debug);
    }

    /**
     * Triggers touch starts events.
     *
     * @param chartX
     *        X position on the chart.
     *
     * @param chartY
     *        Y position on the chart.
     *
     * @param twoFingers
     *        Whether to use one or two fingers for the gesture.
     *
     * @param extra
     *        Extra properties for the event arguments.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public touchStart (
        chartX: number,
        chartY: number,
        twoFingers?: boolean,
        extra?: any,
        debug?: boolean
    ) {

        const target = this.elementFromPoint(chartX, chartY);

        extra = (extra || {});
        extra.preventDefault = (extra.preventDefault || function () {});
        extra.relatedTarget = (extra.relatedTarget || target);

        if (twoFingers === true) {
            extra.touches = (
                extra.touches ||
                TestController.createTouchList([
                    { pageX: (chartX - 11), pageY: (chartY - 11) },
                    { pageX: (chartX + 11), pageY: (chartY + 11) }
                ])
            );
        } else {
            extra.touches = (
                extra.touches ||
                TestController.createTouchList([
                    { pageX: chartX, pageY: chartY }
                ])
            );
        }

        this.triggerEvent('touchstart', chartX, chartY, extra, debug);
        if ((window as any).Pointer) {
            this.triggerEvent('pointerdown', chartX, chartY, extra, debug);
        } else if ((window as any).MSPointer) {
            this.triggerEvent(
                'MSPointerDown', chartX, chartY, extra, debug
            );
        }
    }

    /**
     * Trigger an event. The target element will be found based on the chart
     * coordinates. This function is called behind the shorthand functions
     * like .click() and .mousemove().
     *
     * @param type
     *        Event type.
     *
     * @param chartX
     *        X relative to the chart.
     *
     * @param chartY
     *        Y relative to the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public triggerEvent (
        type: string,
        chartX: number,
        chartY: number,
        extra?: any,
        debug?: boolean
    ) {

        chartX = (chartX || 0);
        chartY = (chartY || 0);

        let chartOffset = Highcharts.offset(this.chart.container),
            element,
            evt = (
                document.createEvent ?
                    document.createEvent('Events') :
                    new Event(type, { bubbles: true, cancelable: true })
            );

        if (document.createEvent) {
            evt.initEvent(type, true, true);
        }

        (evt as any).pageX = (chartOffset.left + chartX);
        (evt as any).pageY = (chartOffset.top + chartY);

        if (extra) {
            Object.keys(extra).forEach(function (key) {
                (evt as any)[key] = extra[key];
            });
        }

        // Leave marks for debugging
        if (debug) {
            const marker = this.chart.renderer
                .circle(
                    chartX,
                    chartY,
                    (type === 'mousemove' ? 2 : 3)
                )
                .attr({
                    fill: 'white',
                    stroke: (
                        type === 'mousemove' ?
                            'blue' :
                            type === 'mousedown' ?
                                'green' :
                                'red'
                    ),
                    'stroke-width': (type === 'mousemove' ? 1 : 2),
                    zIndex: 100
                }) as Highcharts.SVGElement;

            marker
                .css({
                    'pointer-events': 'none'
                })
                .add();
        }

        // Find an element related to the coordinates and fire event.
        element = (
            (extra && extra.currentTarget) ||
            this.elementFromPoint(chartX, chartY)
        );
        if (element) {
            element.dispatchEvent(evt);
        }
    }

    /**
     * Triggers an event.
     *
     * @param chartX
     *        X relative to the chart.
     *
     * @param chartY
     *        Y relative to the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public mouseDown (
        chartX?: number,
        chartY?: number,
        extra?: any,
        debug?: boolean
    ) {
        this.triggerEvent(
            'mousedown',
            (chartX || this.positionX),
            (chartY || this.positionY),
            extra,
            debug
        );
    }

    /**
     * Triggers an event.
     *
     * @param chartX
     *        X relative to the chart.
     *
     * @param chartY
     *        Y relative to the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public mouseMove (
        chartX?: number,
        chartY?: number,
        extra?: any,
        debug?: boolean
    ) {
        this.triggerEvent(
            'mousemove',
            (chartX || this.positionX),
            (chartY || this.positionY),
            extra,
            debug
        );
    }

    /**
     * Triggers an event.
     *
     * @param chartX
     *        X relative to the chart.
     *
     * @param chartY
     *        Y relative to the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public mouseOut (
        chartX?: number,
        chartY?: number,
        extra?: any,
        debug?: boolean
    ) {
        this.triggerEvent(
            'mouseout',
            (chartX || this.positionX),
            (chartY || this.positionY),
            extra,
            debug
        );
    }

    /**
     * Triggers an event.
     *
     * @param chartX
     *        X relative to the chart.
     *
     * @param chartY
     *        Y relative to the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public mouseOver (
        chartX?: number,
        chartY?: number,
        extra?: any,
        debug?: boolean
    ) {
        this.triggerEvent(
            'mouseover',
            (chartX || this.positionX),
            (chartY || this.positionY),
            extra,
            debug
        );
    }

    /**
     * Triggers an event.
     *
     * @param chartX
     *        X relative to the chart.
     *
     * @param chartY
     *        Y relative to the chart.
     *
     * @param extra
     *        Extra properties for the event arguments, for example
     *        `{ shiftKey: true }` to emulate that the shift key has been
     *        pressed in a mouse event.
     *
     * @param debug
     *        Add marks where the event was triggered. Should not be
     *        enabled in production, as it slows down the test and also
     *        leaves an element that might catch events and mess up the
     *        test result.
     */
    public mouseUp (
        chartX?: number,
        chartY?: number,
        extra?: any,
        debug?: boolean
    ) {
        this.triggerEvent(
            'mouseup',
            (chartX || this.positionX),
            (chartY || this.positionY),
            extra,
            debug
        );
    }
}
