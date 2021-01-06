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

import Axis from './Axis.js';
import H from '../Globals.js';
const {
    isTouchDevice
} = H;
import U from '../Utilities.js';
const {
    addEvent,
    correctFloat,
    defined,
    isNumber,
    pick
} = U;

/**
 * @private
 */
declare module './Types' {
    interface AxisComposition {
        navigatorAxis?: NavigatorAxis['navigatorAxis'];
    }
    interface AxisTypeRegistry {
        NavigatorAxis: NavigatorAxis;
    }
}

/* eslint-disable valid-jsdoc */

/**
 * @private
 * @class
 */
class NavigatorAxisAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(axis: NavigatorAxis) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    public axis: NavigatorAxis;
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
     * @param {number} [pxMin]
     * @param {number} [pxMax]
     * @param {number} [fixedMin]
     * @param {number} [fixedMax]
     * @return {*}
     */
    public toFixedRange(
        pxMin?: number,
        pxMax?: number,
        fixedMin?: number,
        fixedMax?: number
    ): Highcharts.RangeObject {
        const navigator = this;
        const axis = navigator.axis;
        const chart = axis.chart;

        var fixedRange = chart && chart.fixedRange,
            halfPointRange = (axis.pointRange || 0) / 2,
            newMin = pick<number|undefined, number>(
                fixedMin, axis.translate(pxMin as any, true, !axis.horiz) as any
            ),
            newMax = pick<number|undefined, number>(
                fixedMax, axis.translate(pxMax as any, true, !axis.horiz) as any
            ),
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

/**
 * @private
 * @class
 */
class NavigatorAxis {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * @private
     */
    public static readonly AdditionsClass = NavigatorAxisAdditions;

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @private
     */
    public static compose(AxisClass: typeof Axis): void {

        AxisClass.keepProps.push('navigatorAxis');

        /* eslint-disable no-invalid-this */

        addEvent(AxisClass, 'init', function (): void {
            const axis = this;

            if (!axis.navigatorAxis) {
                axis.navigatorAxis = new NavigatorAxisAdditions(axis as NavigatorAxis);
            }
        });

        // For Stock charts, override selection zooming with some special
        // features because X axis zooming is already allowed by the Navigator
        // and Range selector.
        addEvent(AxisClass, 'zoom', function (e: Record<string, any>): void {
            const axis = this as NavigatorAxis;
            const chart = axis.chart;
            const chartOptions = chart.options;
            const navigator = chartOptions.navigator;
            const navigatorAxis = axis.navigatorAxis;
            const pinchType = (chartOptions.chart as any).pinchType;
            const rangeSelector = chartOptions.rangeSelector;
            const zoomType = (chartOptions.chart as any).zoomType;

            let previousZoom;

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

                    previousZoom = navigatorAxis.previousZoom;
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
        });

        /* eslint-enable no-invalid-this */

    }
}

interface NavigatorAxis extends Axis {
    navigatorAxis: NavigatorAxisAdditions;
}

export default NavigatorAxis;
