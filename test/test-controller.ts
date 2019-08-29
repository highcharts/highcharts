/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

/* *
 *
 *  Types
 *
 * */

/**
 * DOM elements
 */
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

/**
 * SVG clip paths
 */
interface ClipPaths {
    elements: Array<HighchartsElement>;
    values: Array<string>;
}

/**
 * Chart position of a controller instance
 */
interface TestControllerPosition extends Highcharts.PositionObject {
    relatedTarget: (HighchartsElement | null);
}

/**
 * Page coordinates of a controller instance
 */
interface TestControllerTouchPosition {
    pageX: number;
    pageY: number;
}

/**
 * Touch coordinates
 */
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
        positions: TestControllerTouchPositions
    ): TestControllerTouchPositions {
        positions.item = function (
            this: TestControllerTouchPositions,
            i: number
        ) {
            return this[i];
        };
        return positions;
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
        a: TestControllerPoint, b: TestControllerPoint, interval: number = 1
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
    public constructor (chart: Highcharts.Chart) {

        if (!(this instanceof TestController)) {
            return new TestController(chart);
        }

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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        extra: any = undefined,
        debug: boolean = false
    ) {
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        useMSWorkaround: boolean = true
    ): (HighchartsElement | null) {

        const chartOffset = Highcharts.offset(this.chart.container);
        let clipPaths;
        
        if (useMSWorkaround) {
            clipPaths = this.setUpMSWorkaround()
        }
        

        const element = document.elementFromPoint(
            (chartOffset.left + chartX),
            (chartOffset.top + chartY)
        ) as HighchartsElement;

        // Reset clip paths for Edge and IE
        if (clipPaths) {
            this.tearDownMSWorkaround(clipPaths);
        }

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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        extra: any = undefined,
        debug: boolean = false
    ) {
        this.triggerEvent('mousedown', chartX, chartY, extra, debug);
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        extra: any = undefined,
        debug: boolean = false
    ) {
        this.triggerEvent('mousemove', chartX, chartY, extra, debug);
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        extra: any = undefined,
        debug: boolean = false
    ) {
        this.triggerEvent('mouseout', chartX, chartY, extra, debug);
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        extra: any = undefined,
        debug: boolean = false
    ) {
        this.triggerEvent('mouseover', chartX, chartY, extra, debug);
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        extra: any = undefined,
        debug: boolean = false
    ) {
        this.triggerEvent('mouseup', chartX, chartY, extra, debug);
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
        chartX: number,
        chartY: number,
        extra: any = undefined,
        debug: boolean = false
    ) {

        const fromPosition = this.getPosition();
        const from = [fromPosition.x, fromPosition.y] as TestControllerPoint;
        const to = [chartX, chartY] as TestControllerPoint;
        const points = TestController.getPointsBetween(from, to);

        let point: TestControllerPoint,
            relatedTarget = fromPosition.relatedTarget,
            target,
            x1,
            y1;

        let clipPaths = this.setUpMSWorkaround();

        for (let i = 0, ie = points.length; i < ie; ++i) {

            point = points[i];

            x1 = point[0];
            y1 = point[1];
            target = this.elementFromPoint(x1, y1, false);

            if (target !== relatedTarget) {
                // First trigger a mouseout on the old target.
                this.triggerEvent(
                    'mouseout',
                    x1, y1,
                    Highcharts.merge({
                        currentTarget: relatedTarget,
                        relatedTarget: target
                    }, extra),
                    debug
                );
            }

            this.triggerEvent('mousemove', x1, y1, extra, debug);

            if (target !== relatedTarget) {
                // Then trigger a mouseover on the new target.
                if (target) {
                    this.triggerEvent(
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
        }

        this.tearDownMSWorkaround(clipPaths);

        // Update controller positions and relatedTarget.
        this.setPosition(chartX, chartY);
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
        startPoint: TestControllerPoint = [this.positionX, this.positionY],
        endPoint: TestControllerPoint = [this.positionX, this.positionY],
        extra: any = undefined,
        debug: boolean = false
    ) {
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        distance: number = 10,
        debug: boolean = false
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

        const movePoints1 = TestController.getPointsBetween(
            startPoint1, endPoint1, 1
        );
        const movePoints2 = TestController.getPointsBetween(
            startPoint2, endPoint2, 1
        );
        const target = this.elementFromPoint(chartX, chartY);

        let extra,
            movePoint1,
            movePoint2;

        for (let i = 0, ie = (movePoints1.length - 1); i <= ie; ++i) {

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
     * Edge and IE are unable to get elementFromPoint when the group has a
     * clip path. It reports the first underlying element with no clip path.
     */
    private setUpMSWorkaround () {
        const clipPaths: ClipPaths = {
            elements: [],
            values: []
        };

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
        return clipPaths;
        
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
    public setPosition (
        chartX: number = this.positionX,
        chartY: number = this.positionY
    ) {
        this.positionX = chartX;
        this.positionY = chartY;
        this.relatedTarget = this.elementFromPoint(chartX, chartY);
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
        startPoint: TestControllerPoint = [this.positionX, this.positionY],
        endPoint: TestControllerPoint = [this.positionX, this.positionY],
        twoFingers: boolean = false,
        debug: boolean = false
    ) {

        const movePoints = TestController
            .getPointsBetween(startPoint, endPoint);

        this.touchStart(
            startPoint[0], startPoint[1], twoFingers, undefined, debug
        );

        let movePoint;

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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        twoFingers: boolean = false,
        debug: boolean = false
    ) {
        this.touchStart(chartX, chartY, twoFingers, undefined, debug);
        this.touchEnd(chartX, chartY, twoFingers, undefined, debug);
    }

    /**
     * Undo the workaround for Edge and IE.
     * 
     * @param clipPaths
     *        The clip paths that were returned from the `setUpMSWorkaround`
     *        function
     */
    private tearDownMSWorkaround (
        clipPaths: ClipPaths
    ) {
        // Reset clip paths for Edge and IE
        if (clipPaths) {
            clipPaths.elements.forEach(function (elemCP, i) {
                elemCP.setAttribute('clip-path', clipPaths.values[i]);
            });
        }
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        twoFingers: boolean = false,
        extra: any = undefined,
        debug: boolean = false
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
        if (Highcharts.Pointer) {
            this.triggerEvent('pointerup', chartX, chartY, extra, debug);
        } else if ((Highcharts as any).MSPointer) {
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        twoFingers: boolean = false,
        extra: any = undefined,
        debug: boolean = false
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

        if (Highcharts.Pointer) {
            this.triggerEvent('pointermove', chartX, chartY, extra, debug);
        } else if ((Highcharts as any).MSPointer) {
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        twoFingers: boolean = false,
        extra: any = undefined,
        debug: boolean = false
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
        if (Highcharts.Pointer) {
            this.triggerEvent('pointerdown', chartX, chartY, extra, debug);
        } else if ((Highcharts as any).MSPointer) {
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
        chartX: number = this.positionX,
        chartY: number = this.positionY,
        extra: any = undefined,
        debug: boolean = false
    ) {

        const chartOffset = Highcharts.offset(this.chart.container);
        const evt = (
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
        let element = (
            (extra && extra.currentTarget) ||
            this.elementFromPoint(chartX, chartY)
        );

        if (element) {
            element.dispatchEvent(evt);
        }
    }
}
