/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/
/**
 * DOM elements
 */
declare type HighchartsElement = (Highcharts.HTMLDOMElement | Highcharts.SVGDOMElement);
/**
 * Contains x and y position relative to the chart.
 */
declare type TestControllerPoint = [number, number];
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
interface TestControllerTouchPositions extends Array<TestControllerTouchPosition> {
    [index: number]: TestControllerTouchPosition;
    item?: (index: number) => TestControllerTouchPosition;
}
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
declare class TestController {
    /**
     * Mock a TochList element with required internal methods.
     *
     * @param arr
     *        The list of touches.
     */
    private static createTouchList;
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
    private static getPointsBetween;
    /**
     * The test controller makes it easy to emulate mouse and touch stuff on the
     * chart.
     *
     * @param chart
     *        Chart to control
     */
    constructor(chart: Highcharts.Chart);
    private chart;
    private positionX;
    private positionY;
    private relatedTarget;
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
    click(chartX?: number, chartY?: number, extra?: any, debug?: boolean): void;
    /**
     * Get the element from a point on the chart.
     *
     * @param chartX
     *        X relative to the chart.
     *
     * @param chartY
     *        Y relative to the chart.
     */
    elementFromPoint(chartX?: number, chartY?: number, useMSWorkaround?: boolean): (HighchartsElement | null);
    /**
     * Get the current position of the cursor.
     */
    getPosition(): TestControllerPosition;
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
    mouseDown(chartX?: number, chartY?: number, extra?: any, debug?: boolean): void;
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
    mouseMove(chartX?: number, chartY?: number, extra?: any, debug?: boolean): void;
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
    mouseOut(chartX?: number, chartY?: number, extra?: any, debug?: boolean): void;
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
    mouseOver(chartX?: number, chartY?: number, extra?: any, debug?: boolean): void;
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
    mouseUp(chartX?: number, chartY?: number, extra?: any, debug?: boolean): void;
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
    moveTo(chartX: number, chartY: number, extra?: any, debug?: boolean): void;
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
    pan(startPoint?: TestControllerPoint, endPoint?: TestControllerPoint, extra?: any, debug?: boolean): void;
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
    pinch(chartX?: number, chartY?: number, distance?: number, debug?: boolean): void;
    /**
     * Edge and IE are unable to get elementFromPoint when the group has a
     * clip path. It reports the first underlying element with no clip path.
     */
    private setUpMSWorkaround;
    /**
     * Move the cursor position to a new position, without firing events.
     *
     * @param chartX
     *        New x position on the chart.
     *
     * @param chartY
     *        New y position on the chart.
     */
    setPosition(chartX?: number, chartY?: number): void;
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
    slide(startPoint?: TestControllerPoint, endPoint?: TestControllerPoint, twoFingers?: boolean, debug?: boolean): void;
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
    tap(chartX?: number, chartY?: number, twoFingers?: boolean, debug?: boolean): void;
    /**
     * Undo the workaround for Edge and IE.
     *
     * @param clipPaths
     *        The clip paths that were returned from the `setUpMSWorkaround`
     *        function
     */
    private tearDownMSWorkaround;
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
    touchEnd(chartX?: number, chartY?: number, twoFingers?: boolean, extra?: any, debug?: boolean): void;
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
    touchMove(chartX?: number, chartY?: number, twoFingers?: boolean, extra?: any, debug?: boolean): void;
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
    touchStart(chartX?: number, chartY?: number, twoFingers?: boolean, extra?: any, debug?: boolean): void;
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
    triggerEvent(type: string, chartX?: number, chartY?: number, extra?: any, debug?: boolean): void;
}
