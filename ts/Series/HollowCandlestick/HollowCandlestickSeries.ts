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

import HollowCandlestickPoint from './HollowCandlestickPoint';
import type HollowCandlestickSeriesOptions from './HollowCandlestickSeriesOptions';
import D from '../../Core/DefaultOptions.js';
const { defaultOptions } = D;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

const {
    seriesTypes: {
        column: ColumnSeries,
        ohlc: OHLCSeries,
        candlestick: CandlestickSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

/* *
 *
 *  Code
 *
 * */

/**
 * The hollowcandlestick series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.hollowcandlestick
 *
 * @augments Highcharts.seriesTypes.ohlc
 */
class HollowCandlestickSeries extends CandlestickSeries {

    /* *
     *
     * Static properties
     *
     * */

    /**
     * A hollow candlestick chart is a style of financial chart used to
     * describe price movements over time.
     *
     * @sample stock/demo/hollowcandlestick/
     *         Hollow Candlestick chart
     *
     * @extends      plotOptions.candlestick
     * @excluding    borderColor,borderRadius,borderWidth
     * @product      highstock
     * @optionparent plotOptions.hollowcandlestick
     */
    public static defaultOptions: HollowCandlestickSeriesOptions =
    merge(OHLCSeries.defaultOptions, defaultOptions.plotOptions, {

    } as HollowCandlestickSeriesOptions);

    /* *
     *
     * Properties
     *
     * */
    public data: Array<HollowCandlestickPoint> = void 0 as any;

    public options: HollowCandlestickSeriesOptions = void 0 as any;

    public points: Array<HollowCandlestickPoint> = void 0 as any;

    /* *
     *
     * Functions
     *
     * */
    /* eslint-disable valid-jsdoc */

}

interface HollowCandlestickSeries {
    pointClass: typeof HollowCandlestickPoint;
}

/* *
 *
 * Registry
 *
 * */

declare module '../../Core/Series/SeriesType'{
    interface SeriesTypeRegistry {
        hollowcandlestick: typeof HollowCandlestickSeries;
    }
}

SeriesRegistry.registerSeriesType('hollowcandlestick', HollowCandlestickSeries);

/* *
 *
 * Default Export
 *
 * */
export default HollowCandlestickSeries;

/* *
 *
 * API Options
 *
 * */
/**
 * A `hollowcandlestick` series. If the [type](#series.candlestick.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.hollowcandlestick
 * @excluding dataParser, dataURL, marker
 * @product   highstock
 * @apioption series.hollowcandlestick
 */

/**
 * An array of data points for the series. For the `hollowcandlestick` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 7, 2, 0, 4],
 *        [1, 1, 4, 2, 8],
 *        [2, 3, 3, 9, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.hollowcandlestick.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 9,
 *        high: 2,
 *        low: 4,
 *        close: 6,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 1,
 *        high: 4,
 *        low: 7,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.candlestick.data
 * @excluding y
 * @product   highstock
 * @apioption series.hollowcandlestick.data
 */

''; // adds doclets above to transpilat
