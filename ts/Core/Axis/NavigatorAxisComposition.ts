/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

/** @internal */
declare module './AxisComposition' {
    interface AxisComposition {
        navigatorAxis?: NavigatorAxisAdditions;
    }
}

/** @internal */
export declare class NavigatorAxisComposition extends Axis {
    navigatorAxis: NavigatorAxisAdditions;
}

/* *
 *
 *  Functions
 *
 * */

/** @internal */
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
 * @internal
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
                e.min = previousZoom[0]!;
                e.max = previousZoom[1]!;
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

/** @internal */
class NavigatorAxisAdditions {

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(
        AxisClass: typeof Axis
    ): void {

        if (!AxisClass.keepProps.includes('navigatorAxis')) {
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

    public destroy(): void {
        this.axis = void 0 as any;
    }

    /**
     * Add logic to normalize the zoomed range in order to preserve the pressed
     * state of range selector buttons
     *
     * @internal
     * @function Highcharts.Axis#toFixedRange
     */
    public toFixedRange(
        pxMin?: number,
        pxMax?: number,
        fixedMin?: number,
        fixedMax?: number
    ): RangeSelector.RangeObject {
        const axis = this.axis,
            halfPointRange = (axis.pointRange || 0) / 2;

        let newMin = pick<number|undefined, number>(
                fixedMin, axis.translate(pxMin as any, true, !axis.horiz)
            ),
            newMax = pick<number|undefined, number>(
                fixedMax, axis.translate(pxMax as any, true, !axis.horiz)
            );


        // Add/remove half point range to/from the extremes (#1172)
        if (!defined(fixedMin)) {
            newMin = correctFloat(newMin + halfPointRange);
        }
        if (!defined(fixedMax)) {
            newMax = correctFloat(newMax - halfPointRange);
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

/** @internal */
export default NavigatorAxisAdditions;
