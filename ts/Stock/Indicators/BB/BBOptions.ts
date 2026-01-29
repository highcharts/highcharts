/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../../Core/Color/ColorType';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type MultipleLinesComposition from '../MultipleLinesComposition';
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
 * Bollinger bands (BB). This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/bollinger-bands
 *         Bollinger bands
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/bollinger-bands
 * @optionparent plotOptions.bb
 * @interface Highcharts.BBOptions
 */
export interface BBOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * Option for fill color between lines in Bollinger Bands Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @type      {Highcharts.ColorType}
     * @since     9.3.2
     * @apioption plotOptions.bb.fillColor
     */
    fillColor?: ColorType;

    /**
     * Parameters used in calculation of the regression points.
     */
    params?: BBParamsOptions;

    /**
     * Bottom line options.
     */
    bottomLine?: Record<string, CSSObject>;

    /**
     * Top line options.
     *
     * @extends plotOptions.bb.bottomLine
     */
    topLine?: Record<string, CSSObject>;
}

export interface BBParamsOptions extends SMAParamsOptions {
    /**
     * Standard deviation for top and bottom bands.
     */
    standardDeviation: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default BBOptions;
