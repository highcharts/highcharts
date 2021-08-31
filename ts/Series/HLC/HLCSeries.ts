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

import type HLCSeriesOptions from './HLCSeriesOptions';
import HLCPoint from './HLCPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        ohlc: OHLCSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The hlc series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.hlc
 *
 * @augments Highcharts.Series
 */
class HLCSeries extends OHLCSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * An HLC chart is a style of financial chart used to describe price
     * movements over time. It displays open, high, low and close values per
     * data point.
     *
     * @sample stock/demo/hlc/
     *         HLC chart
     *
     * @extends      plotOptions.column
     * @excluding    borderColor, borderRadius, borderWidth, crisp, stacking,
     *               stack
     * @product      highstock
     * @optionparent plotOptions.hlc
     */
    public static defaultOptions: HLCSeriesOptions = merge(
        OHLCSeries.defaultOptions,
        { } as HLCSeriesOptions
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<HLCPoint> = void 0 as any;

    public options: HLCSeriesOptions = void 0 as any;

    public points: Array<HLCPoint> = void 0 as any;

    public yData: Array<Array<number>> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Draw the data points
     * @private
     */
    public drawPoints(): void {
        // TO DO
    }

    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface HLCSeries {
    pointAttrToOptions: Record<string, string>;
    pointClass: typeof HLCPoint;
    toYData(point: HLCPoint): HLCPoint.PointShortOptions;
}

HLCSeries.prototype.pointClass = HLCPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        hlc: typeof HLCSeries;
    }
}
SeriesRegistry.registerSeriesType('hlc', HLCSeries);

/* *
 *
 *  Default Export
 *
 * */

export default HLCSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * An `hlc` series. If the [type](#series.hlc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.hlc
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.hlc
 */

/**
 * An array of data points for the series. For the `hlc` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4\.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 6, 5, 6, 7],
 *        [1, 9, 4, 8, 2],
 *        [2, 6, 3, 4, 10]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.hlc.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 3,
 *        high: 4,
 *        low: 5,
 *        close: 2,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 4,
 *        high: 3,
 *        low: 6,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.arearange.data
 * @excluding y, marker
 * @product   highstock
 * @apioption series.hlc.data
 */

/**
 * The closing value of each data point.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.hlc.data.close
 */

''; // adds doclets above to transpilat
