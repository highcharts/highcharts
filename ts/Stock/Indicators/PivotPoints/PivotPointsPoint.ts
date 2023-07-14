/* *
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

/**
 * @private
 */
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

    public P: number = void 0 as any;
    public pivotLine: string = void 0 as any;
    public series: PivotPointsIndicator = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public destroyElements(
        this: PivotPointsPoint
    ): void {
        destroyExtraLabels(this, 'destroyElements');
    }

    // This method is called when removing points, e.g. series.update()
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
