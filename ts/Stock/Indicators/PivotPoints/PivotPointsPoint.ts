/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import PivotPointsIndicator from './PivotPointsIndicator';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;

/* eslint-disable valid-jsdoc */

/**
 * @private
 */
function destroyExtraLabels(
    point: PivotPointsPoint,
    functionName: string
): void {
    var props: Array<string> = point.series.pointArrayMap,
        prop: string,
        i: number = props.length;

    (SeriesRegistry.seriesTypes.sma.prototype.pointClass.prototype as any)[functionName].call(point);

    while (i--) {
        prop = 'dataLabel' + props[i];
        // S4 dataLabel could be removed by parent method:
        if ((point as any)[prop] && (point as any)[prop].element) {
            (point as any)[prop].destroy();
        }
        (point as any)[prop] = null;
    }
}

/* eslint-enable valid-jsdoc */

/* *
 *
 *  Class
 *
 * */

class PivotPointsPoint extends SMAIndicator.prototype.pointClass {

    /**
     *
     * Properties
     *
     */

    public P: number = void 0 as any;
    public pivotLine: string = void 0 as any;
    public series: PivotPointsIndicator = void 0 as any;

    /**
      *
      * Functions
      *
      */

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
