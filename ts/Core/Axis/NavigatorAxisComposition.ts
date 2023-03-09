/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type Axis from './Axis.js';
import type RangeSelector from '../../Stock/RangeSelector/RangeSelector';

import H from '../Globals.js';
const { isTouchDevice } = H;
import U from '../Utilities.js';
const {
    addEvent,
    correctFloat,
    defined,
    isNumber,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './AxisComposition' {
    interface AxisComposition {
        navigatorAxis?: NavigatorAxisAdditions;
    }
}

export declare class NavigatorAxisComposition extends Axis {
    navigatorAxis: NavigatorAxisAdditions;
}

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<unknown> = [];

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function onAxisInit(
    this: Axis
): void {
    const axis = this as NavigatorAxisComposition;

    if (!axis.navigatorAxis) {
        axis.navigatorAxis = new NavigatorAxisAdditions(axis);
    }
}

/**
 * For Stock charts, override selection zooming with some special features
 * because X axis zooming is already allowed by the Navigator and Range
 * selector.
 * @private
 */
function onAxisZoom(
    this: Axis,
    e: AnyRecord
): void {
    const axis = this as NavigatorAxisComposition,
        chart = axis.chart,
        chartOptions = chart.options,
        navigator = chartOptions.navigator,
        navigatorAxis = axis.navigatorAxis,
        pinchType = chartOptions.chart.zooming.pinchType,
        rangeSelector = chartOptions.rangeSelector,
        zoomType = chartOptions.chart.zooming.type;

    if (axis.isXAxis && ((navigator && navigator.enabled) ||
            (rangeSelector && rangeSelector.enabled))) {

        // For y only zooming, ignore the X axis completely
        if (zoomType === 'y') {
            e.zoomed = false;

        // For xy zooming, record the state of the zoom before zoom
        // selection, then when the reset button is pressed, revert to
        // this state. This should apply only if the chart is
        // initialized with a range (#6612), otherwise zoom all the way
        // out.
        } else if (
            (
                (!isTouchDevice && zoomType === 'xy') ||
                (isTouchDevice && pinchType === 'xy')
            ) &&
            axis.options.range
        ) {

            const previousZoom = navigatorAxis.previousZoom;

            if (defined(e.newMin)) {
                navigatorAxis.previousZoom = [axis.min, axis.max];
            } else if (previousZoom) {
                e.newMin = previousZoom[0];
                e.newMax = previousZoom[1];
                navigatorAxis.previousZoom = void 0;
            }
        }

    }
    if (typeof e.zoomed !== 'undefined') {
        e.preventDefault();
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 */
class NavigatorAxisAdditions {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @private
     */
    public static compose(
        AxisClass: typeof Axis
    ): void {

        if (U.pushUnique(composedMembers, AxisClass)) {
            AxisClass.keepProps.push('navigatorAxis');

            addEvent(AxisClass, 'init', onAxisInit);
            addEvent(AxisClass, 'zoom', onAxisZoom);
        }

    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        axis: NavigatorAxisComposition
    ) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    public axis: NavigatorAxisComposition;
    public fake?: boolean;
    public previousZoom?: [(number|null), (number|null)];

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public destroy(): void {
        this.axis = void 0 as any;
    }

    /**
     * Add logic to normalize the zoomed range in order to preserve the pressed
     * state of range selector buttons
     *
     * @private
     * @function Highcharts.Axis#toFixedRange
     */
    public toFixedRange(
        pxMin?: number,
        pxMax?: number,
        fixedMin?: number,
        fixedMax?: number
    ): RangeSelector.RangeObject {
        const axis = this.axis,
            chart = axis.chart;

        let newMin = pick<number|undefined, number>(
                fixedMin, axis.translate(pxMin as any, true, !axis.horiz)
            ),
            newMax = pick<number|undefined, number>(
                fixedMax, axis.translate(pxMax as any, true, !axis.horiz)
            );

        const fixedRange = chart && chart.fixedRange,
            halfPointRange = (axis.pointRange || 0) / 2,
            changeRatio = fixedRange && (newMax - newMin) / fixedRange;

        // Add/remove half point range to/from the extremes (#1172)
        if (!defined(fixedMin)) {
            newMin = correctFloat(newMin + halfPointRange);
        }
        if (!defined(fixedMax)) {
            newMax = correctFloat(newMax - halfPointRange);
        }

        // If the difference between the fixed range and the actual requested
        // range is too great, the user is dragging across an ordinal gap, and
        // we need to release the range selector button.
        if ((changeRatio as any) > 0.7 && (changeRatio as any) < 1.3) {
            if (fixedMax) {
                newMin = newMax - (fixedRange as any);
            } else {
                newMax = newMin + (fixedRange as any);
            }
        }
        if (!isNumber(newMin) || !isNumber(newMax)) { // #1195, #7411
            newMin = newMax = void 0 as any;
        }

        return {
            min: newMin,
            max: newMax
        };
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default NavigatorAxisAdditions;
