/* *
 *
 *  (c) 2023-2026 Highsoft AS
 *  Author: Torstein Hønsi, Askel Eirik Johansson
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';
import type Axis from '../../Core/Axis/Axis';
import type GlobalsBase from '../../Core/GlobalsBase';
import type PointerEvent from '../../Core/PointerEvent';
import type MouseWheelZoomOptions from './MouseWheelZoomOptions';
import type DOMElementType from '../../Core/Renderer/DOMElementType';

import NBU from '../Annotations/NavigationBindingsUtilities.js';
import {
    addEvent,
    defined,
    fireEvent,
    internalClearTimeout,
    isObject,
    merge
} from '../../Shared/Utilities.js';
const { getAssignedAxis } = NBU;

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<(Function|GlobalsBase)> = [],
    defaultOptions: MouseWheelZoomOptions = {
        enabled: true,
        sensitivity: 1.1,
        showResetButton: false
    };

let wheelTimer: number;
// Accumulated sub-point pixel movement for ordinal wheel panning, so that
// fractional point movements add up across notches instead of being lost to
// rounding. Reset when the wheel gesture ends or reverses direction.
let wheelPanRemainder = 0;
type TransformGeometry = Pick<
    NonNullable<Parameters<Chart['transform']>[0]>,
    'from'|'to'
>;

/* *
 *
 *  Functions
 *
 * */

/** @internal */
const optionsToObject = (
    options?: boolean|MouseWheelZoomOptions
): MouseWheelZoomOptions => {
    if (!isObject(options)) {
        options = {
            enabled: options ?? true
        };
    }
    return merge(defaultOptions, options);
};

/** @internal */
const getAxes = function (
    chart: Chart,
    xAxis: Array<Axis>,
    yAxis: Array<Axis>,
    options: MouseWheelZoomOptions
): Array<Axis> {
    const type = (options.type ?? chart.zooming.type ?? '');

    if (type === 'x') {
        return xAxis;
    }

    if (type === 'y') {
        return yAxis;
    }

    if (type === 'xy') {
        return chart.axes;
    }

    return [];
};

/** @internal */
const scheduleDrop = function (chart: Chart): void {
    if (defined(wheelTimer)) {
        internalClearTimeout(wheelTimer);
    }

    // Some time after the last mousewheel event, run drop. In case any of
    // the affected axes had `startOnTick` or `endOnTick`, they will be
    // re-adjusted now.
    wheelTimer = setTimeout((): void => {
        // End of the gesture, start accumulating from scratch next time.
        wheelPanRemainder = 0;
        chart.pointer?.drop();
    }, 400);
};

/** @internal */
const transformBy = function (
    chart: Chart,
    xAxis: Array<Axis>,
    yAxis: Array<Axis>,
    options: MouseWheelZoomOptions,
    geometry: TransformGeometry
): boolean {
    const hasTransformed = chart.transform({
        axes: getAxes(chart, xAxis, yAxis, options),
        ...geometry,
        trigger: 'mousewheel',
        allowResetButton: options.showResetButton
    });

    if (hasTransformed) {
        scheduleDrop(chart);
    }

    return hasTransformed;
};

/** @internal */
const zoomBy = function (
    chart: Chart,
    howMuch: number,
    xAxis: Array<Axis>,
    yAxis: Array<Axis>,
    mouseX: number,
    mouseY: number,
    options: MouseWheelZoomOptions
): boolean {
    return transformBy(chart, xAxis, yAxis, options, {
        // Create imaginary reference and target rectangles around the mouse
        // point that scales up or down with `howMuch`;
        to: {
            x: mouseX - 5,
            y: mouseY - 5,
            // Must use 10 to get passed the limit for too small reference.
            // Below this, the transform will default to a pan.
            width: 10,
            height: 10
        },
        from: {
            x: mouseX - 5 * howMuch,
            y: mouseY - 5 * howMuch,
            width: 10 * howMuch,
            height: 10 * howMuch
        }
    });
};


/** @internal */
const panBy = function (
    chart: Chart,
    howMuch: number,
    xAxis: Array<Axis>,
    yAxis: Array<Axis>,
    options: MouseWheelZoomOptions
): boolean {
    const axes = getAxes(chart, xAxis, yAxis, options),
        type = (options.type ?? chart.zooming.type ?? '');

    // Nothing to pan (e.g. no zooming type set).
    if (!axes.length || !type) {
        return false;
    }

    const chartOptions = chart.options.chart,
        prevPanning = chartOptions.panning,
        ordinalAxis = chart.xAxis[0] as Axis & {
            ordinal?: {
                slope?: number;
                overscrollPointsRange?: number;
            };
        };

    // The wheel sends a constant pixel delta per notch. For an ordinal x-axis
    // the pan is handled by `OrdinalAxis` `onChartPan`, which works in whole
    // point units. Simply rounding the pixel step to points would make the
    // on-screen pan speed grow with the zoom level (points get wider, so a
    // whole point spans more pixels). Instead, accumulate the pixel movement
    // and only pan by the whole points it adds up to, carrying the remainder
    // over to the next notch. This keeps a constant on-screen speed, matching
    // a non-ordinal axis.
    let panX = howMuch;
    if (type !== 'y' && ordinalAxis?.isOrdinal && ordinalAxis.ordinal) {
        const closestPointRange = ordinalAxis.closestPointRange ||
                ordinalAxis.ordinal.overscrollPointsRange,
            pointPixelWidth = ordinalAxis.translationSlope *
                (ordinalAxis.ordinal.slope || (closestPointRange as number));
        if (pointPixelWidth) {
            // Restart the accumulation when the scroll direction reverses.
            if (howMuch * wheelPanRemainder < 0) {
                wheelPanRemainder = 0;
            }

            wheelPanRemainder += howMuch;

            // Whole points accumulated so far, truncated towards zero.
            const ratio = wheelPanRemainder / pointPixelWidth,
                units = ratio < 0 ? Math.ceil(ratio) : Math.floor(ratio);

            // Keep the sub-point pixel remainder for the next notch.
            wheelPanRemainder -= units * pointPixelWidth;
            panX = units * pointPixelWidth;
        }
    }

    // Mimic an offset-only drag so that `pan` handlers reading
    // `chart.mouseDownX` and the event's `chartX` see the intended movement.
    // The `mouseWheel` flag lets the ordinal pan handler use single-point
    // granularity (see `OrdinalAxis` `onChartPan`).
    const panEvent: AnyRecord = {
        originalEvent: { chartX: panX, chartY: howMuch },
        mouseWheel: true
    };

    chart.mouseDownX = 0;
    chart.mouseDownY = 0;

    // Expose the pan type for the duration of the event so that axis pan
    // handlers, notably the ordinal axis (see `OrdinalAxis` `onChartPan`),
    // can decide whether and how to intercept this pan. Restored right after
    // since `fireEvent` runs synchronously.
    chartOptions.panning = {
        enabled: prevPanning?.enabled ?? true,
        type
    };

    let hasPanned = false;

    // Fire the `pan` event so that registered pan handlers (such as the
    // ordinal axis) get a chance to handle it. For regular axes, the default
    // function below performs the transform.
    fireEvent(chart, 'pan', panEvent, (): void => {
        hasPanned = chart.transform({
            axes,
            to: {
                x: howMuch,
                y: howMuch
            },
            trigger: 'mousewheel',
            allowResetButton: options.showResetButton
        });
    });

    chartOptions.panning = prevPanning;

    // An axis pan handler that intercepts the pan (e.g. the ordinal axis)
    // prevents the default and performs the pan itself, so treat a prevented
    // default as a successful pan.
    if (panEvent.defaultPrevented) {
        hasPanned = true;
    }

    if (hasPanned) {
        scheduleDrop(chart);
    }

    return hasPanned;
};

/** @internal */
function onAfterGetContainer(this: Chart): void {
    const wheelZoomOptions = optionsToObject(this.zooming.mouseWheel),
        panKey = this.options.chart.panKey;

    if (wheelZoomOptions.enabled) {
        addEvent(this.container, 'wheel', (e: PointerEvent): void => {
            e = this.pointer?.normalize(e) || e;

            const { pointer } = this,
                allowZoom = pointer && !pointer.inClass(
                    e.target as DOMElementType,
                    'highcharts-no-mousewheel'
                );

            // Firefox uses e.detail, WebKit and IE uses deltaX, deltaY, deltaZ.
            if (this.isInsidePlot(
                e.chartX - this.plotLeft,
                e.chartY - this.plotTop
            ) && allowZoom) {

                const wheelSensitivity = wheelZoomOptions.sensitivity || 1.1,
                    delta = e.detail || ((e.deltaY || 0) / 120),
                    xAxisCoords = getAssignedAxis(
                        pointer.getCoordinates(e).xAxis
                    ),
                    yAxisCoords = getAssignedAxis(
                        pointer.getCoordinates(e).yAxis
                    );

                const panKeyPressed = panKey && e[`${panKey}Key`];
                if (panKeyPressed) {
                    // Pan
                    const hasPanned = panBy(
                        this,
                        delta * 15 * wheelSensitivity,
                        xAxisCoords ? [xAxisCoords.axis] : this.xAxis,
                        yAxisCoords ? [yAxisCoords.axis] : this.yAxis,
                        wheelZoomOptions
                    );

                    // Prevent page scroll
                    if (hasPanned) {
                        e.preventDefault?.();
                    }
                } else {

                    const hasZoomed = zoomBy(
                        this,
                        Math.pow(
                            wheelSensitivity,
                            delta
                        ),
                        xAxisCoords ? [xAxisCoords.axis] : this.xAxis,
                        yAxisCoords ? [yAxisCoords.axis] : this.yAxis,
                        e.chartX,
                        e.chartY,
                        wheelZoomOptions
                    );

                    // Prevent page scroll
                    if (hasZoomed) {
                        e.preventDefault?.();
                    }
                }
            }


        });
    }
}


/** @internal */
function compose(
    ChartClass: typeof Chart
): void {

    if (composedClasses.indexOf(ChartClass) === -1) {
        composedClasses.push(ChartClass);

        addEvent(ChartClass, 'afterGetContainer', onAfterGetContainer);
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const MouseWheelZoomComposition = {
    compose
};

/** @internal */
export default MouseWheelZoomComposition;

/* *
 *
 *  API Options
 *
 * */

/**
 * The mouse wheel zoom is a feature included in Highcharts Stock, but is also
 * available for Highcharts Core as a module. Zooming with the mouse wheel is
 * enabled by default in Highcharts Stock. In Highcharts Core it is enabled if
 * [chart.zooming.type](chart.zooming.type) is set. It can be disabled by
 * setting this option to `false`.
 *
 * @type      {boolean|object}
 * @since 11.1.0
 * @requires  modules/mouse-wheel-zoom
 * @sample    {highcharts} highcharts/mouse-wheel-zoom/enabled
 *            Enable or disable
 * @sample    {highstock} stock/mouse-wheel-zoom/enabled
 *            Enable or disable
 * @apioption chart.zooming.mouseWheel
 */

/**
 * Zooming with the mouse wheel can be disabled by setting this option to
 * `false`.
 *
 * @type      {boolean}
 * @default   true
 * @since 11.1.0
 * @requires  modules/mouse-wheel-zoom
 * @apioption chart.zooming.mouseWheel.enabled
 */

/**
 * Adjust the sensitivity of the zoom. Sensitivity of mouse wheel or trackpad
 * scrolling. `1` is no sensitivity, while with `2`, one mouse wheel delta will
 * zoom in `50%`.
 *
 * @type      {number}
 * @default   1.1
 * @since 11.1.0
 * @requires  modules/mouse-wheel-zoom
 * @sample    {highcharts} highcharts/mouse-wheel-zoom/sensitivity
 *            Change mouse wheel zoom sensitivity
 * @sample    {highstock} stock/mouse-wheel-zoom/sensitivity
 *            Change mouse wheel zoom sensitivity
 * @apioption chart.zooming.mouseWheel.sensitivity
 */

/**
 * Decides in what dimensions the user can zoom scrolling the wheel. Can be one
 * of `x`, `y` or `xy`. In Highcharts Core, if not specified here, it will
 * inherit the type from [chart.zooming.type](chart.zooming.type). In Highcharts
 * Stock, it defaults to `x`.
 *
 * Note that particularly with mouse wheel in the y direction, the zoom is
 * affected by the default [yAxis.startOnTick](#yAxis.startOnTick) and
 * [endOnTick]((#yAxis.endOnTick)) settings. In order to respect these settings,
 * the zoom level will adjust after the user has stopped zooming. To prevent
 * this, consider setting `startOnTick` and `endOnTick` to `false`.
 *
 * @type      {string}
 * @default   {highcharts} undefined
 * @default   {highstock} x
 * @validvalue ["x", "y", "xy"]
 * @since 11.1.0
 * @requires  modules/mouse-wheel-zoom
 * @apioption chart.zooming.mouseWheel.type
 */

/**
 * Whether to enable the reset zoom button when zooming with the mouse wheel.
 *
 * @type      {boolean}
 * @default   false
 * @since     12.5.0
 * @requires  modules/mouse-wheel-zoom
 * @sample    {highcharts} highcharts/mouse-wheel-zoom/reset-zoom-button
 *            Enable reset zoom button for mouse wheel zooming
 * @sample    {highstock} stock/mouse-wheel-zoom/reset-zoom-button
 *            Enable reset zoom button for mouse wheel zooming
 * @apioption chart.zooming.mouseWheel.showResetButton
 */

(''); // Keeps doclets above in JS file
