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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type CandlestickSeriesOptions from './CandlestickSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A candlestick chart is a style of financial chart used to describe
 * price movements over time.
 *
 * @sample stock/demo/candlestick/
 *         Candlestick chart
 *
 * @extends      plotOptions.ohlc
 * @excluding    borderColor,borderRadius,borderWidth,stack,stacking
 * @product      highstock
 * @optionparent plotOptions.candlestick
 */
const CandlestickSeriesDefaults: CandlestickSeriesOptions = {
    states: {
        /**
         * @extends plotOptions.column.states.hover
         * @product highstock
         */
        hover: {
            /**
             * The pixel width of the line/border around the
             * candlestick.
             *
             * @product highstock
             */
            lineWidth: 2
        }
    },

    /**
     * @type    {number|null}
     * @product highstock
     */
    threshold: null,

    /**
     * What type of legend symbol to render for this series. The default
     * `candlestick` shows two candles, each a wick with a rectangular body.
     * The first stands for a falling point, the second for a rising one.
     *
     * @sample {highstock} stock/plotoptions/financial-legend-symbols/
     *         Financial series legend symbols
     *
     * @default   'candlestick'
     * @product   highstock
     * @apioption plotOptions.candlestick.legendSymbol
     */
    legendSymbol: 'candlestick',

    /**
     * The color of the line/border of the candlestick.
     *
     * In styled mode, the line stroke can be set with the
     * `.highcharts-candlestick-series .highcharts-point` rule.
     *
     * @see [upLineColor](#plotOptions.candlestick.upLineColor)
     *
     * @sample {highstock} stock/plotoptions/candlestick-linecolor/
     *         Candlestick line colors
     *
     * @type    {Highcharts.ColorType}
     * @product highstock
     */
    lineColor: 'var(--highcharts-neutral-color-100)',

    /**
     * The pixel width of the candlestick line/border. Defaults to `1`.
     *
     *
     * In styled mode, the line stroke width can be set with the
     * `.highcharts-candlestick-series .highcharts-point` rule.
     *
     * @product highstock
     */
    lineWidth: 1,

    /**
     * The fill color of the candlestick when values are rising.
     *
     * In styled mode, the up color can be set with the
     * `.highcharts-candlestick-series .highcharts-point-up` rule.
     *
     * @sample {highstock} stock/plotoptions/candlestick-color/
     *         Custom colors
     * @sample {highstock} highcharts/css/candlestick/
     *         Colors in styled mode
     *
     * @type    {Highcharts.ColorType}
     * @product highstock
    */
    upColor: 'var(--highcharts-background-color)',

    /**
     * @product highstock
     */
    stickyTracking: true
};

/**
 * The approximate pixel width of each group. If for example a series
 * with 30 points is displayed over a 600 pixel wide plot area, no
 * grouping is performed. If however the series contains so many points
 * that the spacing is less than the `groupPixelWidth`, Highcharts will
 * try to group it into appropriate groups so that each is more or less
 * `groupPixelWidth` pixels wide.
 *
 * @type      {number}
 * @default   10
 * @product   highstock
 * @apioption plotOptions.candlestick.dataGrouping.groupPixelWidth
 */

/**
 * The color of the line/border of the hovered candlestick. When `undefined`,
 * the line color of the normal state is used.
 *
 * @type      {Highcharts.ColorType}
 * @product   highstock
 * @apioption plotOptions.candlestick.states.hover.lineColor
 */

/**
 * The specific line color for up candle sticks. The default is to
 * inherit the general `lineColor` setting.
 *
 * @sample {highstock} stock/plotoptions/candlestick-linecolor/
 *         Candlestick line colors
 *
 * @type      {Highcharts.ColorType}
 * @since     1.3.6
 * @product   highstock
 * @apioption plotOptions.candlestick.upLineColor
 */

/**
 * A `candlestick` series. If the [type](#series.candlestick.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.candlestick
 * @excluding borderColor, borderRadius, borderWidth, marker, stack,
 *            stacking
 * @product   highstock
 * @apioption series.candlestick
 */

/**
 * Options for the selected point. These settings override the normal state
 * options when a point is selected.
 *
 * @excluding borderColor
 * @product   highstock
 * @apioption series.candlestick.states.select
 */

/**
 * An array of data points for the series. For the `candlestick` series
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
 *        [0, 4, 7, 2, 6],
 *        [1, 6, 8, 4, 5],
 *        [2, 5, 9, 3, 8]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.candlestick.turboThreshold), this option is not
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
 * @basic
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.ohlc.data
 * @excluding y
 * @product   highstock
 * @apioption series.candlestick.data
 */

/**
 * A name for the dash style to use for the candlestick. Overrides
 * `dashStyle` on the series.
 *
 * @type      {Highcharts.DashStyleValue}
 * @product   highstock
 * @apioption series.candlestick.data.dashStyle
 */

/**
 * The color of the line/border of the candlestick. Overrides `lineColor` and
 * `upLineColor` on the series.
 *
 * @type      {Highcharts.ColorType}
 * @product   highstock
 * @apioption series.candlestick.data.lineColor
 */

/**
 * A pixel value specifying a fixed width for the candlestick. Overrides
 * `pointWidth` on the series.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.candlestick.data.pointWidth
 */

''; // Adds doclets above to transpiled

/* *
 *
 *  Default Export
 *
 * */

export default CandlestickSeriesDefaults;
