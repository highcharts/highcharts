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

import D from '../../Core/Defaults.js';
const { setOptions } = D;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    pick,
    defined
} = U;

/* *
 *
 *  Declarations
 *
 * */

/*
    TODO: Declare module options

    interface ?? extends ChartzoomingOptions {
        zoomByMouseWheel?: MouseWheelZoomingOptions;
    }

    export interface ChartMouseWheelZoomOptions {
        enabled: boolean;
        sensitivity?: number;
    }
 */


/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<(Function|GlobalsLike)> = [];
const mockOptions = {
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
const fitToBox = function (
    inner: any,
    outer: any
): any {
    [['x', 'width'], ['y', 'height']].forEach(function (dim): void {
        const pos = dim[0],
            size = dim[1];

        if (inner[pos] + inner[size] > outer[pos] + outer[size]) { // right
            // the general size is greater, fit fully to outer
            if (inner[size] > outer[size]) {
                inner[size] = outer[size];
                inner[pos] = outer[pos];
            } else { // align right
                inner[pos] = outer[pos] +
                    outer[size] - inner[size];
            }
        }
        if (inner[size] > outer[size]) {
            inner[size] = outer[size];
        }
        if (inner[pos] < outer[pos]) {
            inner[pos] = outer[pos];
        }
    });

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

        let xRange = xAxis.max - xAxis.min,
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

        const zoomX = /x/.test(chart.options.chart.zooming.type as string),
            zoomY = /y/.test(chart.options.chart.zooming.type as string);
        // Zoom
        if (typeof howMuch !== 'undefined' && !zoomOut) {
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
    if (mockOptions.enabled) {
        const chart = this;

        addEvent(this.container, 'wheel', (e: PointerEvent): void => {
            e = this.pointer.normalize(e);
            // Firefox uses e.detail, WebKit and IE uses deltaX, deltaY, deltaZ.
            let delta = e.detail || ((e.deltaY || 0) / 120);
            if (chart.isInsidePlot(
                e.chartX - chart.plotLeft,
                e.chartY - chart.plotTop
            )) {
                const mouseWheelSensitivity = 1.1; // To do: option?
                zoomBy(
                    chart,
                    Math.pow(
                        mouseWheelSensitivity,
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
