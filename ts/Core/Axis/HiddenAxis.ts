/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Axis from './Axis';
import type Chart from '../Chart/Chart';
import type RadialAxis from './RadialAxis';

/**
 * @private
 */
declare module './Types' {
    interface AxisTypeRegistry {
        HiddenAxis: HiddenAxis;
    }
}

/**
 * @private
 * @class
 */
class HiddenAxis {

    /**
     * Augments methods for the x axis in order to hide it completely. Used for
     * the X axis in gauges
     *
     * @private
     *
     * @param {Highcharts.Axis} axis
     * Radial axis to augment.
     */
    public static init(axis: RadialAxis): void {

        axis.getOffset = function (): void {};

        axis.redraw = function (): void {
            this.isDirty = false; // prevent setting Y axis dirty
        };

        axis.render = function (): void {
            this.isDirty = false; // prevent setting Y axis dirty
        };

        axis.createLabelCollector = function (): Chart.LabelCollectorFunction {
            return function (): undefined {
                return;
            };
        };

        axis.setScale = function (): void {};

        axis.setCategories = function (): void {};

        axis.setTitle = function (): void {};

        axis.isHidden = true;

    }

}

interface HiddenAxis extends Axis {
    isHidden: true;
}

export default HiddenAxis;
