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
    isNumber,
    clamp
} = U;

import NBU from '../Annotations/NavigationBindingsUtilities.js';
import Axis from '../../Core/Axis/Axis';
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
 * @private
 */
const fitToRange = (
    outerStart:number,
    outerWidth:number,
    innerStart:number,
    innerWidth: number
): {
    rangeStart: number,
    rangeWidth: number
} => {
    const outerEnd = outerStart + outerWidth,
        rangeStart = clamp(innerStart, outerStart, outerEnd),
        rangeWidth = rangeStart === outerStart ? outerWidth :
            clamp(innerWidth, outerStart - innerStart, outerEnd - innerStart);

    return {
        rangeStart,
        rangeWidth
    };
};

let wheelTimer: number,
    startOnTick: boolean|undefined,
    endOnTick: boolean|undefined;

/**
 * @private
 */
const zoomOnX = function (
    chart: Chart,
    xAxis: Axis,
    zoomX: boolean,
    mouseX: number,
    howMuch: number,
    centerXArg: number
): boolean {
    let hasZoomed = false;

    if (defined(xAxis.max) && defined(xAxis.min) &&
        defined(xAxis.dataMax) && defined(xAxis.dataMin)) {

        let fixToX = mouseX ? ((mouseX - xAxis.pos) / xAxis.len) : 0.5;
        if (xAxis.reversed && !chart.inverted ||
            chart.inverted && !xAxis.reversed) {
            // We are taking into account that xAxis automatically gets
            // reversed when chart.inverted
            fixToX = 1 - fixToX;
        }

        const xRange = xAxis.max - xAxis.min,
            centerX = pick(centerXArg, xAxis.min + xRange / 2),
            newXRange = xRange * howMuch,
            newXMin = centerX - newXRange * fixToX,
            dataRangeX = pick(xAxis.options.max, xAxis.dataMax) -
                pick(xAxis.options.min, xAxis.dataMin),
            outerX = pick(xAxis.options.min, xAxis.dataMin) -
                dataRangeX * xAxis.options.minPadding,
            outerWidth = dataRangeX + dataRangeX * xAxis.options.minPadding +
                dataRangeX * xAxis.options.maxPadding,
            newExt = fitToRange(
                outerX,
                outerWidth,
                newXMin,
                newXRange
            ),
            zoomOut = (
                newExt.rangeStart <= pick(xAxis.options.min, outerX) &&
                newExt.rangeWidth >= outerWidth &&
                newExt.rangeStart + newExt.rangeWidth <=
                    pick(xAxis.options.max, Number.MIN_VALUE)
            );

        if (zoomX) {
            if (defined(howMuch) && !zoomOut) { // Zoom
                xAxis.setExtremes(
                    newExt.rangeStart,
                    newExt.rangeStart + newExt.rangeWidth,
                    false
                );
                hasZoomed = true;
            } else { // Reset zoom
                xAxis.setExtremes(void 0, void 0, false);
            }
        }
    }

    return hasZoomed;
};

/**
* @private
*/
const zoomOnY = function (
    yAxis: Axis,
    zoomY: boolean,
    mouseY: number,
    howMuch: number,
    centerYArg: number
) : boolean {
    const yOptions = yAxis.options;

    let hasZoomed = false;

    if (defined(yAxis.max) && defined(yAxis.min) &&
        defined(yAxis.dataMax) && defined(yAxis.dataMin)) {

        if (zoomY) {
            // Options interfering with yAxis zoom by setExtremes() returning
            // integers by default.
            if (defined(wheelTimer)) {
                clearTimeout(wheelTimer);
            }

            if (!defined(startOnTick)) {
                startOnTick = yOptions.startOnTick;
                endOnTick = yOptions.endOnTick;
            }

            // Temporarily disable start and end on tick, because they would
            // prevent small increments of zooming.
            if (startOnTick || endOnTick) {
                yOptions.startOnTick = false;
                yOptions.endOnTick = false;
            }
            wheelTimer = setTimeout((): void => {
                if (defined(startOnTick) && defined(endOnTick)) {
                    // Repeat merge after the wheel zoom is finished, #19178
                    yOptions.startOnTick = startOnTick;
                    yOptions.endOnTick = endOnTick;

                    // Set the extremes to the same as they already are, but now
                    // with the original startOnTick and endOnTick. We need
                    // `forceRedraw` otherwise it will detect that the values
                    // haven't changed. We do not use a simple yAxis.update()
                    // because it will destroy the ticks and prevent animation.
                    const { min, max } = yAxis.getExtremes();
                    yAxis.forceRedraw = true;
                    yAxis.setExtremes(min, max);
                    startOnTick = endOnTick = void 0;
                }
            }, 400);
        }

        let fixToY = 1 - (mouseY ? ((mouseY - yAxis.pos) / yAxis.len) : 0.5);
        if (yAxis.reversed) {
            fixToY = 1 - fixToY;
        }

        const yRange = yAxis.max as any - (yAxis.min as any),
            centerY = isNumber(centerYArg) ? centerYArg :
                yAxis.min + yRange / 2,
            newYRange = yRange * howMuch,
            newYMin = centerY - newYRange * fixToY,
            dataRangeY = pick(yAxis.options.max, yAxis.dataMax) -
                pick(yAxis.options.min, yAxis.dataMin),
            outerY = pick(yAxis.options.min, yAxis.dataMin) -
                dataRangeY * yAxis.options.minPadding,
            outerHeight = dataRangeY + dataRangeY * yAxis.options.minPadding +
                dataRangeY * yAxis.options.maxPadding,
            newExt = fitToRange(
                outerY,
                outerHeight,
                newYMin,
                newYRange
            ),
            zoomOut = (
                newExt.rangeStart <= pick(yAxis.options.min, outerY) &&
                newExt.rangeWidth >= outerHeight &&
                newExt.rangeStart + newExt.rangeWidth <=
                    pick(yAxis.options.max, Number.MIN_VALUE)
            );

        if (zoomY) {
            if (defined(howMuch) && !zoomOut) { // Zoom
                yAxis.setExtremes(
                    newExt.rangeStart,
                    newExt.rangeStart + newExt.rangeWidth,
                    false
                );
                hasZoomed = true;
            } else { // Reset zoom
                yAxis.setExtremes(void 0, void 0, false);
            }
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

    const hasZoomedX = zoomOnX(
            chart,
            xAxis,
            zoomX,
            mouseX,
            howMuch,
            centerXArg
        ),
        hasZoomedY = zoomOnY(
            yAxis,
            zoomY,
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
                    xAxis = getAssignedAxis(
                        this.pointer.getCoordinates(e).xAxis
                    ).axis,
                    yAxis = getAssignedAxis(
                        this.pointer.getCoordinates(e).yAxis
                    ).axis;

                const hasZoomed = zoomBy(
                    chart,
                    Math.pow(
                        wheelSensitivity,
                        delta
                    ),
                    xAxis,
                    yAxis,
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
