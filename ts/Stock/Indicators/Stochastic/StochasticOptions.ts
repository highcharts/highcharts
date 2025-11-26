/* *
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
 * Options for the stochastic indicator.
 *
 * @interface Highcharts.StochasticOptions
 * @extends Highcharts.SMAOptions
 */
export interface StochasticOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * Set options for data grouping.
     */
    dataGrouping?: DataGroupingOptions;

    marker?: PointMarkerOptions;

    params?: StochasticParamsOptions;

    /**
     * Smoothed line options.
     */
    smoothedLine?: StochasticSmoothedLineOptions;
}

/**
 * Parameters used in calculation of stochastic values.
 */
export interface StochasticParamsOptions extends SMAParamsOptions {
    /**
     * Periods for stochastic oscillator. First period value for %K, second
     * period value for %D.
     */
    periods?: Array<number>;
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
