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
    pick,
    defined
} = U;

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<(Function|GlobalsLike)> = [];


/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
const fitToBox = function (
    inner: BBoxObject,
    outer: BBoxObject
): BBoxObject {

    // Fit zoomed window to view.
    // x and width
    if (inner.x + inner.width > outer.x + outer.width) {
        if (inner.x > outer.x) {
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
    if (inner.y + inner.width > outer.y + outer.height) {
        if (inner.y > outer.y) {
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
    mouseY: number
): void {
    const xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0];
    if (defined(xAxis.max) && defined(xAxis.min) &&
        defined(yAxis.max) && defined(yAxis.min) &&
        defined(xAxis.dataMax) && defined(xAxis.dataMin) &&
        defined(yAxis.dataMax) && defined(yAxis.dataMin)) {

        const xRange = xAxis.max - xAxis.min,
            centerX = pick(centerXArg, xAxis.min + xRange / 2),
            newXRange = xRange * howMuch,
            yRange = yAxis.max - yAxis.min,
            centerY = pick(centerYArg, yAxis.min + yRange / 2),
            newYRange = yRange * howMuch,
            fixToX = mouseX ? ((mouseX - xAxis.pos) / xAxis.len) : 0.5,
            fixToY = mouseY ? ((mouseY - yAxis.pos) / yAxis.len) : 0.5,
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
        const wheelOptions = chart.options.chart.zooming.mouseWheelZoom,
            type = pick((wheelOptions as MouseWheelZoomOptions).type, 'x'),
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
        wheelZoomOptions = chart.options.chart.zooming.mouseWheelZoom;

    if (wheelZoomOptions) {

        addEvent(this.container, 'wheel', (e: PointerEvent): void => {
            e = this.pointer.normalize(e);
            // Firefox uses e.detail, WebKit and IE uses deltaX, deltaY, deltaZ.
            if (chart.isInsidePlot(
                e.chartX - chart.plotLeft,
                e.chartY - chart.plotTop
            )) {
                const wheelSensitivity = pick(
                        (wheelZoomOptions as MouseWheelZoomOptions).sensitivity,
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
                    e.chartY
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
 * Zooming with the mousewheel can be enabled by setting this option to `true`.
 * More detailed options can be assigned.
 *
 * @type      {boolean| MouseWheelZoomOptions}
 * @since     next
 * @requires  modules/mouse-wheel-zoom
 * @apioption chart.zooming.mouseWheelZoom
 */

(''); // Keeps doclets above in JS file
