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
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    isObject,
    pick,
    defined,
    merge
} = U;

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
const fitToBox = function (
    inner: BBoxObject,
    outer: BBoxObject
): BBoxObject {

    if (inner.x + inner.width > outer.x + outer.width) {
        if (inner.width > outer.width) {
            inner.width = outer.width;
            inner.x = outer.x;
        } else {
            inner.x = outer.x + outer.width - inner.width;
        }
    }
    if (inner.width > outer.width) {
        inner.width = outer.width;
    }
    if (inner.x < outer.x) {
        inner.x = outer.x;
    }

    // y and height
    if (inner.y + inner.height > outer.y + outer.height) {
        if (inner.height > outer.height) {
            inner.height = outer.height;
            inner.y = outer.y;
        } else {
            inner.y = outer.y + outer.height - inner.height;
        }
    }
    if (inner.height > outer.height) {
        inner.height = outer.height;
    }
    if (inner.y < outer.y) {
        inner.y = outer.y;
    }

    return inner;
};


/**
 * @private
 */
const zoomBy = function (
    chart: Chart,
    howMuch: number,
    centerXArg: number,
    centerYArg: number,
    mouseX: number,
    mouseY: number,
    options: MouseWheelZoomOptions
): void {
    const xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0];
    if (defined(xAxis.max) && defined(xAxis.min) &&
        defined(yAxis.max) && defined(yAxis.min) &&
        defined(xAxis.dataMax) && defined(xAxis.dataMin) &&
        defined(yAxis.dataMax) && defined(yAxis.dataMin)) {

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

        let fixToX = mouseX ? ((mouseX - xAxis.pos) / xAxis.len) : 0.5;
        if (xAxis.reversed && !chart.inverted ||
            chart.inverted && !xAxis.reversed) {
            // We are taking into account that xAxis automatically gets
            // reversed when chart.inverted
            fixToX = 1 - fixToX;
        }

        let fixToY = 1 - (mouseY ? ((mouseY - yAxis.pos) / yAxis.len) : 0.5);
        if (yAxis.reversed) {
            fixToY = 1 - fixToY;
        }

        const xRange = xAxis.max - xAxis.min,
            centerX = pick(centerXArg, xAxis.min + xRange / 2),
            newXRange = xRange * howMuch,
            yRange = yAxis.max - yAxis.min,
            centerY = pick(centerYArg, yAxis.min + yRange / 2),
            newYRange = yRange * howMuch,
            newXMin = centerX - newXRange * fixToX,
            newYMin = centerY - newYRange * fixToY,
            newExt = fitToBox({
                x: newXMin,
                y: newYMin,
                width: newXRange,
                height: newYRange
            }, {
                x: xAxis.dataMin,
                y: yAxis.dataMin,
                width: xAxis.dataMax - xAxis.dataMin,
                height: yAxis.dataMax - yAxis.dataMin
            }),
            zoomOut = (
                newExt.x <= xAxis.dataMin &&
                newExt.width >=
                xAxis.dataMax - xAxis.dataMin &&
                newExt.y <= yAxis.dataMin &&
                newExt.height >= yAxis.dataMax - yAxis.dataMin
            );

        const type = pick(
                options.type,
                chart.options.chart.zooming.type,
                'x'
            ),
            zoomX = /x/.test(type),
            zoomY = /y/.test(type);
        // Zoom
        if (defined(howMuch) && !zoomOut) {
            if (zoomX) {
                xAxis.setExtremes(newExt.x, newExt.x + newExt.width, false);
            }
            if (zoomY) {
                yAxis.setExtremes(newExt.y, newExt.y + newExt.height, false);
            }

            // Reset zoom
        } else {
            if (zoomX) {
                xAxis.setExtremes(void 0, void 0, false);
            }
            if (zoomY) {
                yAxis.setExtremes(void 0, void 0, false);
            }
        }

        chart.redraw(false);
    }
};


/**
 * @private
 */
function onAfterGetContainer(this: Chart): void {
    const chart = this,
        wheelZoomOptions =
            optionsToObject(chart.options.chart.zooming.mouseWheel);

    if (wheelZoomOptions.enabled) {

        addEvent(this.container, 'wheel', (e: PointerEvent): void => {
            e = this.pointer.normalize(e);
            // Firefox uses e.detail, WebKit and IE uses deltaX, deltaY, deltaZ.
            if (chart.isInsidePlot(
                e.chartX - chart.plotLeft,
                e.chartY - chart.plotTop
            )) {
                const wheelSensitivity = pick(
                        wheelZoomOptions.sensitivity,
                        1.1
                    ),
                    delta = e.detail || ((e.deltaY || 0) / 120);

                zoomBy(
                    chart,
                    Math.pow(
                        wheelSensitivity,
                        delta
                    ),
                    chart.xAxis[0].toValue(e.chartX),
                    chart.yAxis[0].toValue(e.chartY),
                    e.chartX,
                    e.chartY,
                    wheelZoomOptions
                );
            }

            // prevent page scroll
            if (e.preventDefault) {
                e.preventDefault();
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
 * The mouse wheel zoom is a feature included in Highcharts Stock, but is
 * also available for Highcharts Core as a module. Zooming with the mouse wheel
 * is enabled by default. It can be disabled by setting this option to
 * `false`.
 *
 * @type      {boolean|object}
 * @since     next
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
 * @since     next
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
 * @since     next
 * @requires  modules/mouse-wheel-zoom
 * @sample    {highcharts} highcharts/mouse-wheel-zoom/sensitivity
 *            Change mouse wheel zoom sensitivity
 * @sample    {highstock} stock/mouse-wheel-zoom/sensitivity
 *            Change mouse wheel zoom sensitivity
 * @apioption chart.zooming.mouseWheel.sensitivity
 */

/**
 * Decides in what dimensions the user can zoom scrolling the wheel.
 * Can be one of `x`, `y` or `xy`. If not specified here, it will inherit the
 * type from [chart.zooming.type](chart.zooming.type).
 *
 * @type      {string}
 * @default   x
 * @validvalue ["x", "y", "xy"]
 * @since     next
 * @requires  modules/mouse-wheel-zoom
 * @apioption chart.zooming.mouseWheel.type
 */

(''); // Keeps doclets above in JS file
