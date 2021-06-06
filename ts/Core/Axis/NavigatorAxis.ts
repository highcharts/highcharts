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

import type RangeSelector from '../../Extensions/RangeSelector';

import Axis from './Axis.js';
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
        navigatorAxis?: NavigatorAxis.Additions;
    }
}

declare module './AxisType' {
    interface AxisTypeRegistry {
        NavigatorAxis: NavigatorAxis.Composition;
    }
}

/* *
 *
 *  Composition
 *
 * */

/**
 * @private
 */
namespace NavigatorAxis {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends Axis {
        navigatorAxis: NavigatorAxis.Additions;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedAxisClasses: Array<typeof Axis> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable require-jsdoc, valid-jsdoc */

    export function compose<T extends typeof Axis>(AxisClass: T): (T&typeof Composition) {
        if (composedAxisClasses.indexOf(AxisClass) === -1) {
            composedAxisClasses.push(AxisClass);

            AxisClass.keepProps.push('navigatorAxis');

            /* eslint-disable no-invalid-this */

            addEvent(AxisClass, 'init', function (): void {
                const axis = this;

                if (!axis.navigatorAxis) {
                    axis.navigatorAxis = new Additions(axis as Composition);
                }
            });

            // For Stock charts, override selection zooming with some special
            // features because X axis zooming is already allowed by the
            // Navigator and Range selector.
            addEvent(AxisClass, 'zoom', function (e: AnyRecord): void {
                const axis = this as Composition;
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
                    // selection, then when the reset button is pressed, revert
                    // to this state. This should apply only if the chart is
                    // initialized with a range (#6612), otherwise zoom all the
                    // way out.
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

        return AxisClass as (T&typeof Composition);
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
    export class Additions {

        /* *
        *
        *  Constructors
        *
        * */

        public constructor(axis: Composition) {
            this.axis = axis;
        }

        /* *
        *
        *  Properties
        *
        * */

        public axis: Composition;
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
         * Add logic to normalize the zoomed range in order to preserve the
         * pressed state of range selector buttons
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
        ): RangeSelector.RangeObject {
            const navigator = this,
                axis = navigator.axis,
                chart = axis.chart,
                fixedRange = chart && chart.fixedRange,
                halfPointRange = (axis.pointRange || 0) / 2;

            let newMin = pick<number|undefined, number>(
                    fixedMin, axis.translate(pxMin as any, true, !axis.horiz) as any
                ),
                newMax = pick<number|undefined, number>(
                    fixedMax, axis.translate(pxMax as any, true, !axis.horiz) as any
                );

            const changeRatio = fixedRange && (newMax - newMin) / fixedRange;

            // Add/remove half point range to/from the extremes (#1172)
            if (!defined(fixedMin)) {
                newMin = correctFloat(newMin + halfPointRange);
            }
            if (!defined(fixedMax)) {
                newMax = correctFloat(newMax - halfPointRange);
            }

            // If the difference between the fixed range and the actual
            // requested range is too great, the user is dragging across an
            // ordinal gap, and we need to release the range selector button.
            if (
                changeRatio &&
                changeRatio > 0.7 &&
                changeRatio < 1.3
            ) {
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
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigatorAxis;
