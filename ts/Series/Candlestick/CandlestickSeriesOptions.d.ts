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

import type CandlestickPointOptions from './CandlestickPointOptions';
import type ColorType from '../../Core/Color/ColorType';
import type OHLCSeriesOptions from '../OHLC/OHLCSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A candlestick chart is a style of financial chart used to describe
 * price movements over time.
 *
 * A `candlestick` series. If the [type](#series.candlestick.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @sample stock/demo/candlestick/
 *         Candlestick chart
 *
 * @extends plotOptions.ohlc
 *
 * @extends series,plotOptions.candlestick
 *
 * @excluding borderColor,borderRadius,borderWidth
 *
 * @excluding dataParser, dataURL, marker
 *
 * @product highstock
 */
export interface CandlestickSeriesOptions extends OHLCSeriesOptions {

    /**
     * The color of the line/border of the candlestick.
     *
     * In styled mode, the line stroke can be set with the
     * `.highcharts-candlestick-series .highcahrts-point` rule.
     *
     * @see [upLineColor](#plotOptions.candlestick.upLineColor)
     *
     * @sample {highstock} stock/plotoptions/candlestick-linecolor/
     *         Candlestick line colors
     *
     * @default #000000
     *
     * @product highstock
     */
    lineColor?: ColorType;

    states?: SeriesStatesOptions<CandlestickSeriesOptions>;

    /**
     * The specific line color for up candle sticks. The default is to
     * inherit the general `lineColor` setting.
     *
     * @sample {highstock} stock/plotoptions/candlestick-linecolor/
     *         Candlestick line colors
     *
     * @since 1.3.6
     *
     * @product highstock
     */
    upLineColor?: ColorType;

    /**
     *
     * @extends plotOptions.column.states.hover
     *
     * @product highstock
     *
     * @apioption series.candlestick.upLineColor.hover
     */

    /**
     * An array of data points for the series. For the `candlestick` series
     * type, points can be given in the following ways:
     *
     * 1. An array of arrays with 5 or 4 values. In this case, the values
     *  correspond
     *    to `x,open,high,low,close`. If the first value is a string, it is
     *  applied
     *    as the name of the point, and the `x` value is inferred. The `x`
     *  value can
     *    also be omitted, in which case the inner arrays should be of length 4.
     *    Then the `x` value is automatically calculated, either starting at 0
     *  and
     *    incremented by 1, or from `pointStart` and `pointInterval` given in
     *  the
     *    series options.
     *    ```js
     *    data: [
     *        [0, 7, 2, 0, 4],
     *        [1, 1, 4, 2, 8],
     *        [2, 3, 3, 9, 3]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.candlestick.turboThreshold), this option is
     *  not
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
     * @extends series.ohlc.data
     *
     * @excluding y
     *
     * @product highstock
     */
    data?: Array<(CandlestickPointOptions|PointShortOptions)>;

    /**
     *
     * @product highstock
     */
    stickyTracking?: boolean;

    /**
     * The fill color of the candlestick when values are rising.
     *
     * In styled mode, the up color can be set with the
     * `.highcharts-candlestick-series .highcharts-point-up` rule.
     *
     * @sample {highstock} stock/plotoptions/candlestick-color/
     *         Custom colors
     *
     * @sample {highstock} highcharts/css/candlestick/
     *         Colors in styled mode
     *
     * @default #ffffff
     *
     * @product highstock
     */
    upColor?: ColorType;

    /**
     * The pixel width of the candlestick line/border. Defaults to `1`.
     *
     *
     * In styled mode, the line stroke width can be set with the
     * `.highcharts-candlestick-series .highcahrts-point` rule.
     *
     * @product highstock
     */
    lineWidth?: number;

    /**
     * @product highstock
     */
    threshold?: (number|null);

}

/* *
 *
 *  Default Export
 *
 * */

export default CandlestickSeriesOptions;
