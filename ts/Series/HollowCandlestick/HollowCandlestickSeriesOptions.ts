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

import type CandlestickSeriesOptions from '../Candlestick/CandlestickSeriesOptions';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */


/**
 *
 * @product highstock
 */
export interface HollowCandlestickSeriesOptions extends CandlestickSeriesOptions {

    /**
     * The fill color of the candlestick when the current
     * close is lower than the previous one.
     *
     * @sample stock/plotoptions/hollow-candlestick-color/
     *     Custom colors
     * @sample {highstock} highcharts/css/hollow-candlestick/
     *         Colors in styled mode
     *
     * @default var(--highcharts-negative-color)
     */
    color?: ColorType;

    /**
     * The color of the line/border of the hollow candlestick when
     * the current close is lower than the previous one.
     *
     * @sample stock/plotoptions/hollow-candlestick-color/
     *     Custom colors
     * @sample {highstock} highcharts/css/hollow-candlestick/
     *         Colors in styled mode
     *
     * @default var(--highcharts-negative-color)
     */
    lineColor?: CandlestickSeriesOptions['lineColor'];

    /**
     * The fill color of the candlestick when the current
     * close is higher than the previous one.
     *
     * @sample stock/plotoptions/hollow-candlestick-color/
     *     Custom colors
     * @sample {highstock} highcharts/css/hollow-candlestick/
     *         Colors in styled mode
     *
     * @default var(--highcharts-positive-color)
     */
    upColor?: CandlestickSeriesOptions['upColor'];

    /**
     * The color of the line/border of the hollow candlestick when
     * the current close is higher than the previous one.
     *
     * @sample stock/plotoptions/hollow-candlestick-color/
     *     Custom colors
     * @sample {highstock} highcharts/css/hollow-candlestick/
     *         Colors in styled mode
     *
     * @default var(--highcharts-positive-color)
     */
    upLineColor?: CandlestickSeriesOptions['upLineColor'];

}

/* *
 *
 *  Export
 *
 * */

export default HollowCandlestickSeriesOptions;
