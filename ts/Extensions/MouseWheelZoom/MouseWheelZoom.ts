/* *
 *
 *  (c) 2023 Torstein Honsi, Askel Eirik Johansson
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import type GlobalsLike from '../../Core/GlobalsLike';
import type PointerEvent from '../../Core/PointerEvent';
import type MouseWheelZoomOptions from './MouseWheelZoomOptions';
import type DOMElementType from '../../Core/Renderer/DOMElementType';

import U from '../../Core/Utilities.js';
const {
    addEvent,
    isObject,
    pick,
    defined,
    merge,
    isNumber
} = U;

import NBU from '../Annotations/NavigationBindingsUtilities.js';
const { getAssignedAxis } = NBU;

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<(Function|GlobalsLike)> = [],
    defaultOptions: MouseWheelZoomOptions = {
        enabled: true,
        sensitivity: 1.1
    };


/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
const optionsToObject = (
    options?: boolean|MouseWheelZoomOptions
): MouseWheelZoomOptions => {
    if (!isObject(options)) {
        return merge(defaultOptions,
            { enabled: defined(options) ? options : true }
        );
    }
    return merge(defaultOptions, options);
};

/**
 * Fit a segment inside a range.
 * @private
 * @param {number} outerStart
 * Beginning of the range.
 * @param {number} outerWidth
 * Width of the range.
 * @param {number} innerStart
 * Beginning of the segment.
 * @param {number} innerWidth
 * Width of the segment.
 * @return {Object}
 * Object containing rangeStart and rangeWidth.
 */
const fitToRange = (
    outerStart: number,
    outerWidth: number,
    innerStart: number,
    innerWidth: number
): {
    rangeStart: number,
    rangeWidth: number
} => {
    if (innerStart + innerWidth > outerStart + outerWidth) {
        if (innerWidth > outerWidth) {
            innerWidth = outerWidth;
            innerStart = outerStart;
        } else {
            innerStart = outerStart + outerWidth - innerWidth;
        }
    }
    if (innerWidth > outerWidth) {
        innerWidth = outerWidth;
    }
    if (innerStart < outerStart) {
        innerStart = outerStart;
    }

    return {
        rangeStart: innerStart,
        rangeWidth: innerWidth
    };
};

let wheelTimer: number,
    startOnTick: boolean|undefined,
    endOnTick: boolean|undefined;

/**
 * Temporarly disable `axis.startOnTick` and `axis.endOnTick` to allow zooming
 * for small values.
 * @private
*/
const waitForAutomaticExtremes = function (
    axis: Axis
) : void {
    const axisOptions = axis.options;

    // Options interfering with yAxis zoom by setExtremes() returning
    // integers by default.
    if (defined(wheelTimer)) {
        clearTimeout(wheelTimer);
    }

    if (!defined(startOnTick)) {
        startOnTick = axisOptions.startOnTick;
        endOnTick = axisOptions.endOnTick;
    }

    // Temporarily disable start and end on tick, because they would
    // prevent small increments of zooming.
    if (startOnTick || endOnTick) {
        axisOptions.startOnTick = false;
        axisOptions.endOnTick = false;
    }
    wheelTimer = setTimeout((): void => {
        if (defined(startOnTick) && defined(endOnTick)) {
            // Repeat merge after the wheel zoom is finished, #19178
            axisOptions.startOnTick = startOnTick;
            axisOptions.endOnTick = endOnTick;

            // Set the extremes to the same as they already are, but now
            // with the original startOnTick and endOnTick. We need
            // `forceRedraw` otherwise it will detect that the values
            // haven't changed. We do not use a simple yAxis.update()
            // because it will destroy the ticks and prevent animation.
            const { min, max } = axis.getExtremes();
            axis.forceRedraw = true;
            axis.setExtremes(min, max);
            startOnTick = endOnTick = void 0;
        }
    }, 400);
};

/**
* Calulate the ratio of mouse position on the axis to it's length. If mousePos
* doesn't exist, returns 0.5;
* @private
*/
const getMouseAxisRatio = function (
    chart: Chart,
    axis: Axis,
    mousePos: number | undefined
) : number {
    if (!defined(mousePos)) {
        return 0.5;
    }

    const mouseAxisRatio = (mousePos - axis.pos) / axis.len,
        isXAxis = axis.isXAxis;

    if (isXAxis && (!axis.reversed !== !chart.inverted) ||
            !isXAxis && axis.reversed) {
        // We are taking into account that xAxis automatically gets
        // reversed when chart.inverted
        return 1 - mouseAxisRatio;
    }

    return mouseAxisRatio;
};

/**
* Perform zooming on the passed axis.
* @private
* @param {Highcharts.Chart} chart
* Chart object.
* @param {Highcharts.Axis} axis
* Axis to zoom.
* @param {number} mousePos
* Mouse position on the plot.
* @param {number} howMuch
* Amount of zoom to apply.
* @param {number} centerArg
* Mouse position in axis units.
* @return {boolean}
* True if axis extremes were changed.
*/
const zoomOnDirection = function (
    chart: Chart,
    axis: Axis,
    mousePos: number,
    howMuch: number,
    centerArg: number
) : boolean {
    const isXAxis = axis.isXAxis;

    let hasZoomed = false;

    if (defined(axis.max) && defined(axis.min) &&
        defined(axis.dataMax) && defined(axis.dataMin)) {

        if (!isXAxis) {
            waitForAutomaticExtremes(axis);
        }

        const range = axis.max - axis.min,
            center = isNumber(centerArg) ? centerArg :
                axis.min + range / 2,
            mouseAxisRatio = getMouseAxisRatio(chart, axis, mousePos),
            newRange = range * howMuch,
            newMin = center - newRange * mouseAxisRatio,
            dataRange = pick(axis.options.max, axis.dataMax) -
                pick(axis.options.min, axis.dataMin),
            minPaddingOffset = axis.options.min ? 0 :
                dataRange * axis.options.minPadding,
            maxPaddingOffset = axis.options.max ? 0 :
                dataRange * axis.options.maxPadding,
            outerMin = pick(axis.options.min, axis.dataMin) - minPaddingOffset,
            outerRange = dataRange + maxPaddingOffset + minPaddingOffset,
            newExt = fitToRange(
                outerMin,
                outerRange,
                newMin,
                newRange
            ),
            zoomOut = (
                newExt.rangeStart < pick(axis.options.min, outerMin) ||
                newExt.rangeStart === axis.min &&
                (newExt.rangeWidth > outerRange &&
                newExt.rangeStart + newExt.rangeWidth <
                pick(axis.options.max, Number.MIN_VALUE)) ||
                newExt.rangeWidth === axis.max - axis.min
            );

        if (defined(howMuch) && !zoomOut) { // Zoom
            axis.setExtremes(
                newExt.rangeStart,
                newExt.rangeStart + newExt.rangeWidth,
                false
            );

            hasZoomed = true;
        } else { // Reset zoom
            axis.setExtremes(void 0, void 0, false);

        }
    }

    return hasZoomed;
};

/**
 * @private
 */
const zoomBy = function (
    chart: Chart,
    howMuch: number,
    xAxis: Axis,
    yAxis: Axis,
    mouseX: number,
    mouseY: number,
    options: MouseWheelZoomOptions
): boolean {
    const type = pick(
            options.type,
            chart.zooming.type,
            ''
        ),
        zoomX = /x/.test(type),
        zoomY = /y/.test(type);

    let centerXArg = xAxis.toValue(mouseX),
        centerYArg = yAxis.toValue(mouseY);

    if (chart.inverted) {
        const emulateRoof = yAxis.pos + yAxis.len;

        // Get the correct values
        centerXArg = xAxis.toValue(mouseY);
        centerYArg = yAxis.toValue(mouseX);

        // Swapping x and y for simplicity when chart is inverted.
        const tmp = mouseX;
        mouseX = mouseY;
        mouseY = emulateRoof - tmp + yAxis.pos;
    }

    const hasZoomedX = zoomX && zoomOnDirection(
            chart,
            xAxis,
            mouseX,
            howMuch,
            centerXArg
        ),
        hasZoomedY = zoomY && zoomOnDirection(
            chart,
            yAxis,
            mouseY,
            howMuch,
            centerYArg
        ),
        hasZoomed = hasZoomedX || hasZoomedY;

    if (hasZoomed) {
        chart.redraw(false);
    }

    return hasZoomed;
};

/**
 * @private
 */
function onAfterGetContainer(this: Chart): void {
    const chart = this,
        wheelZoomOptions = optionsToObject(chart.zooming.mouseWheel);

    if (wheelZoomOptions.enabled) {
        addEvent(this.container, 'wheel', (e: PointerEvent): void => {
            e = this.pointer.normalize(e);
            const allowZoom = !chart.pointer.inClass(
                e.target as DOMElementType,
                'highcharts-no-mousewheel'
            );

            // Firefox uses e.detail, WebKit and IE uses deltaX, deltaY, deltaZ.
            if (chart.isInsidePlot(
                e.chartX - chart.plotLeft,
                e.chartY - chart.plotTop
            ) && allowZoom) {

                const wheelSensitivity = wheelZoomOptions.sensitivity || 1.1,
                    delta = e.detail || ((e.deltaY || 0) / 120),
                    xAxisCoords = getAssignedAxis(
                        this.pointer.getCoordinates(e).xAxis
                    ),
                    yAxisCoords = getAssignedAxis(
                        this.pointer.getCoordinates(e).yAxis
                    );

                const hasZoomed = zoomBy(
                    chart,
                    Math.pow(
                        wheelSensitivity,
                        delta
                    ),
                    xAxisCoords ? xAxisCoords.axis : chart.xAxis[0],
                    yAxisCoords ? yAxisCoords.axis : chart.yAxis[0],
                    e.chartX,
                    e.chartY,
                    wheelZoomOptions
                );

                // Prevent page scroll
                if (hasZoomed && e.preventDefault) {
                    e.preventDefault();
                }
            }


        });
    }
}


/**
 * @private
 */
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

const MouseWheelZoomComposition = {
    compose
};

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

(''); // Keeps doclets above in JS file
