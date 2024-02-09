/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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
import type { AxisSetExtremesEventObject } from './AxisOptions';
import type RangeSelector from '../../Stock/RangeSelector/RangeSelector';

import H from '../Globals.js';
const {
    composed,
    isTouchDevice
} = H;
import U from '../Utilities.js';
const {
    addEvent,
    correctFloat,
    defined,
    isNumber,
    pick,
    pushUnique
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
function onAxisSetExtremes(
    this: Axis,
    e: AxisSetExtremesEventObject
): void {
    const axis = this as NavigatorAxisComposition,
        chart = axis.chart,
        chartOptions = chart.options,
        navigator = chartOptions.navigator,
        navigatorAxis = axis.navigatorAxis,
        pinchType = chart.zooming.pinchType,
        rangeSelector = chartOptions.rangeSelector,
        zoomType = chart.zooming.type;

    let zoomed: boolean|undefined;

    if (
        axis.isXAxis &&
        (navigator?.enabled || rangeSelector?.enabled)
    ) {

        // For y only zooming, ignore the X axis completely
        if (zoomType === 'y' && e.trigger === 'zoom') {
            zoomed = false;

        // For xy zooming, record the state of the zoom before zoom selection,
        // then when the reset button is pressed, revert to this state. This
        // should apply only if the chart is initialized with a range (#6612),
        // otherwise zoom all the way out.
        } else if (
            (
                (e.trigger === 'zoom' && zoomType === 'xy') ||
                (isTouchDevice && pinchType === 'xy')
            ) &&
            axis.options.range
        ) {

            const previousZoom = navigatorAxis.previousZoom;

            // Minimum defined, zooming in
            if (defined(e.min)) {
                navigatorAxis.previousZoom = [axis.min, axis.max];

            // Minimum undefined, resetting zoom
            } else if (previousZoom) {
                e.min = previousZoom[0];
                e.max = previousZoom[1];
                navigatorAxis.previousZoom = void 0;
            }
        }

    }
    if (typeof zoomed !== 'undefined') {
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

        if (pushUnique(composed, this.compose)) {
            AxisClass.keepProps.push('navigatorAxis');

            addEvent(AxisClass, 'init', onAxisInit);
            addEvent(AxisClass, 'setExtremes', onAxisSetExtremes);
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
    public previousZoom?: [number|undefined, number|undefined];

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
            halfPointRange = (axis.pointRange || 0) / 2;

        // Add/remove half point range to/from the extremes (#1172)
        if (!defined(fixedMin)) {
            newMin = correctFloat(newMin + halfPointRange);
        }
        if (!defined(fixedMax)) {
            newMax = correctFloat(newMax - halfPointRange);
        }

        // Make sure panning to the edges does not decrease the zoomed range
        if (fixedRange && axis.dataMin && axis.dataMax) {
            if (newMax >= axis.dataMax) {
                newMin = correctFloat(axis.dataMax - fixedRange);
            }

            if (newMin <= axis.dataMin) {
                newMax = correctFloat(axis.dataMin + fixedRange);
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
