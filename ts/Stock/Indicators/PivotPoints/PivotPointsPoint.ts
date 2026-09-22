/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SMAPointType from '../SMA/SMAPoint';
import type PivotPointsIndicator from './PivotPointsIndicator';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const SMAPoint: typeof SMAPointType =
    SeriesRegistry.seriesTypes.sma.prototype.pointClass;

/* *
 *
 *  Functions
 *
 * */

/** @internal */
function destroyExtraLabels(
    point: PivotPointsPoint,
    functionName: string
): void {
    const props: Array<string> = point.series.pointArrayMap;
    let prop: string,
        i: number = props.length;

    (SeriesRegistry.seriesTypes.sma.prototype.pointClass.prototype as any)[
        functionName
    ].call(point);

    while (i--) {
        prop = 'dataLabel' + props[i];
        // S4 dataLabel could be removed by parent method:
        if ((point as any)[prop] && (point as any)[prop].element) {
            (point as any)[prop].destroy();
        }
        (point as any)[prop] = null;
    }
}

/* *
 *
 *  Class
 *
 * */

class PivotPointsPoint extends SMAPoint {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public P!: number;
    /** @internal */
    public pivotLine!: string;
    /** @internal */
    public series!: PivotPointsIndicator;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public destroyElements(
        this: PivotPointsPoint
    ): void {
        destroyExtraLabels(this, 'destroyElements');
    }

    // This method is called when removing points, e.g. series.update()
    /** @internal */
    public destroy(
        this: PivotPointsPoint
    ): void {
        destroyExtraLabels(this, 'destroyElements');
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default PivotPointsPoint;
