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

import type CSSObject from '../../../Core/Renderer/CSSObject';
import type ColorType from '../../../Core/Color/ColorType';
import type DataGroupingOptions from
    '../../../Extensions/DataGrouping/DataGroupingOptions';
import type MultipleLinesComposition from '../MultipleLinesComposition';
import type { PointMarkerOptions } from '../../../Core/Series/PointOptions';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Stochastic oscillator. This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/stochastic
 *         Stochastic oscillator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/stochastic
 * @interface Highcharts.StochasticOptions
 */
export interface StochasticOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    dataGrouping?: DataGroupingOptions;
    marker?: PointMarkerOptions;
    params?: StochasticParamsOptions;
    smoothedLine?: StochasticSmoothedLineOptions;
}

export interface StochasticParamsOptions extends SMAParamsOptions {
    /**
     * Periods for Stochastic oscillator: [%K, %D].
     *
     * @default [14, 3]
     */
    periods?: Array<number>;

    /* *
     *
     *  Excluded
     *
     * */

    index?: undefined;
    period?: undefined;
}

export interface StochasticSmoothedLineOptions {
    /**
     * Styles for a smoothed line.
     */
    styles?: StochasticSmoothedLineStyleOptions;
}

/**
 * Styles for the smoothed line.
 */
export interface StochasticSmoothedLineStyleOptions extends CSSObject {
    /**
     * Pixel width of the line.
     *
     * @default 1
     */
    lineWidth?: number;

    /**
     * Color of the line. If not set, it's inherited from
     * [plotOptions.stochastic.color](#plotOptions.stochastic.color).
     */
    lineColor?: ColorType;
}

/* *
 *
 *  Default Export
 *
 * */

export default StochasticOptions;
