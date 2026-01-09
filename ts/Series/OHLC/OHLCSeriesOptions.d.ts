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

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type HLCSeriesOptions from '../HLC/HLCSeriesOptions';
import type OHLCPointOptions from './OHLCPointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Line/LineSeriesOptions' {
    interface LineSeriesOptions {

        /**
         * The parameter allows setting line series type and use OHLC
         * indicators. Data in OHLC format is required.
         *
         * @sample {highstock} stock/indicators/use-ohlc-data
         *         Use OHLC data format to plot line chart
         *
         * @product highstock
         */
        useOhlcData?: boolean;

    }
}

/**
 * An OHLC chart is a style of financial chart used to describe price
 * movements over time. It displays open, high, low and close values per
 * data point.
 *
 * A `ohlc` series. If the [type](#series.ohlc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample stock/demo/ohlc
 *         OHLC chart
 *
 * @extends plotOptions.hlc
 *
 * @extends series,plotOptions.ohlc
 *
 * @excluding dataParser, dataURL
 *
 * @product highstock
 */
export interface OHLCSeriesOptions extends HLCSeriesOptions {

    /**
     * An array of data points for the series. For the `ohlc` series type,
     * points can be given in the following ways:
     *
     * 1. An array of arrays with 5 or 4 values. In this case, the values
     *  correspond
     *    to `x,open,high,low,close`. If the first value is a string, it is
     *  applied
     *    as the name of the point, and the `x` value is inferred. The `x`
     *  value can
     *    also be omitted, in which case the inner arrays should be of length
     *  4\.
     *    Then the `x` value is automatically calculated, either starting at 0
     *  and
     *    incremented by 1, or from `pointStart` and `pointInterval` given in
     *  the
     *    series options.
     *    ```js
     *    data: [
     *        [0, 6, 5, 6, 7],
     *        [1, 9, 4, 8, 2],
     *        [2, 6, 3, 4, 10]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.ohlc.turboThreshold), this option is not
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
     * @type {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
     *
     * @extends series.arearange.data
     *
     * @excluding y, marker
     *
     * @product highstock
     */
    data?: Array<(OHLCPointOptions|PointShortOptions)>;

    /**
     * Determines which one of  `open`, `high`, `low`, `close` values should
     * be represented as `point.y`, which is later used to set dataLabel
     * position and [compare](#plotOptions.series.compare).
     *
     * @default close
     *
     * @validvalue ["open","high","low","close"]
     *
     * @product highstock
     */
    pointValKey?: string;

    states?: SeriesStatesOptions<OHLCSeriesOptions>;

    /**
     * Line color for up points.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highstock
     */
    upColor?: ColorType;

}

/* *
 *
 *  Default Export
 *
 * */

export default OHLCSeriesOptions;
