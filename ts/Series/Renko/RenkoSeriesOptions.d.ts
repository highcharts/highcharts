/* *
 *
 *  (c) 2010-2024 Pawel Lysy
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

import type CandlestickSeriesOptions from '../Candlestick/CandlestickSeriesOptions';
import type RenkoPointOptions from './RenkoPointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

/**
 * An Renko series is a style of financial chart used to describe price
 * movements over time. It displays open, high, low and close values per
 * data point.
 *
 * A `renko` series. If the [type](#series.renko.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @sample stock/demo/renko/
 *         Renko Series
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.renko
 *
 * @product highstock
 *
 * @requires modules/renko
 *
 * @excluding dataParser, dataURL, marker
 */
export interface RenkoSeriesOptions extends CandlestickSeriesOptions {
    /**
     *
     * Color of the point if there is a down trend. (color of point with up
     * trend is inferred from series.color)
     */
    downColor: ColorType;
    /**
     *
     * The size of the individual box, representing a point. Can be set in yAxis
     * value, or percent value of the first point e.g. if first point's value is
     * 200, and box size is set to `20%`, the box will be 40, so the new point
     * will be drawn when the next value changes for more than 40.
     */
    boxSize: string | number;

    /**
     * An array of data points for the series. For the `renko` series
     * type, points can be given in the following ways:
     *
     * 1. An array of arrays with 1 or 2 values correspond to `x,close`. If the
     * first value is a string, it is applied as the name of the point, and the
     * `x` value is inferred. The `x` value can also be omitted, in which case
     * the inner arrays should be of length 4. Then the `x` value is
     * automatically calculated, either starting at 0 and incremented by 1, or
     * from `pointStart` and `pointInterval` given in the series options.
     *    ```js
     *    data: [
     *        [0, 7],
     *        [1, 1],
     *        [2, 3]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. With renko series, the data
     * does not directly correspond to the points in the series. the reason
     * is that the points are calculated based on the trends and boxSize.
     * Setting options for individual point is impossible.
     *
     *    ```js
     *    data: [{
     *        x: 1,
     *        close: 6
     *    }, {
     *        x: 1,
     *        close: 7,
     *    }]
     *    ```
     *
     * @type {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
     *
     * @extends series.column.data
     *
     * @excluding y
     *
     * @product highstock
     */
    data?: Array<RenkoPointOptions | PointShortOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default RenkoSeriesOptions;
