/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type {
    HLCSeriesOptions,
    HLCSeriesTooltipOptions
} from '../HLC/HLCSeriesOptions';
import type OHLCPointOptions from './OHLCPointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {

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
     *        [0, 4, 7, 2, 6],
     *        [1, 6, 8, 4, 5],
     *        [2, 5, 9, 3, 8]
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
     *        high: 9,
     *        low: 2,
     *        close: 7,
     *        name: "Point2",
     *        color: "#00FF00"
     *    }, {
     *        x: 1,
     *        open: 7,
     *        high: 8,
     *        low: 4,
     *        close: 5,
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
     * What type of legend symbol to render for this series. The default
     * `ohlc` shows two stems, each with an open tick on the left and a close
     * tick on the right. The first stands for a falling point, the second
     * for a rising one.
     *
     * @sample {highstock} stock/plotoptions/financial-legend-symbols/
     *         Financial series legend symbols
     *
     * @default ohlc
     *
     * @product highstock
     */
    legendSymbol?: string;

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

    tooltip?: OHLCSeriesTooltipOptions;

    /**
     * Line color for up points.
     *
     * @type {Highcharts.ColorType}
     *
     * @product highstock
     */
    upColor?: ColorType;

}

export interface OHLCSeriesTooltipOptions extends HLCSeriesTooltipOptions {
    /**
     * @default '<span style="color:{point.color}">●</span> <b> {series.name}</b><br/>{series.chart.options.lang.stockOpen}: {point.open}<br/>{series.chart.options.lang.stockHigh}: {point.high}<br/>{series.chart.options.lang.stockLow}: {point.low}<br/>{series.chart.options.lang.stockClose}: {point.close}<br/>'
     */
    pointFormat?: HLCSeriesTooltipOptions['pointFormat'];
}

/* *
 *
 *  Default Export
 *
 * */

export default OHLCSeriesOptions;
