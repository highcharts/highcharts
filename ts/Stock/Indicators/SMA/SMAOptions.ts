/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type LineSeriesOptions from '../../../Series/Line/LineSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Simple moving average indicator (SMA). This series requires `linkedTo`
 * option to be set.
 *
 * @sample {highstock} stock/indicators/sma
 *         Simple moving average indicator
 *
 * @extends      plotOptions.line
 * @since        6.0.0
 * @excluding    allAreas, colorAxis, dragDrop, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking, useOhlcData
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @optionparent plotOptions.sma
 * @interface Highcharts.SMAOptions
 */
export interface SMAOptions extends LineSeriesOptions {
    /**
     * Whether to compare indicator to the main series values
     * or indicator values.
     *
     * @sample {highstock} stock/plotoptions/series-comparetomain/
     *         Difference between comparing SMA values to the main series
     *         and its own values.
     *
     * @type {boolean}
     */
    compareToMain?: boolean;
    data?: Array<Array<number>>;
    params?: SMAParamsOptions;
}

export interface SMAParamsOptions {
    /**
     * The point index which indicator calculations will base. For
     * example using OHLC data, index=2 means the indicator will be
     * calculated using Low values.
     */
    index?: number;
    /**
     * The base period for indicator calculations. This is the number of
     * data points which are taken into account for the indicator
     * calculations.
     */
    period?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default SMAOptions;
