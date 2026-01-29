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

import type CSSObject from '../../../Core/Renderer/CSSObject';
import type ColorType from '../../../Core/Color/ColorType';
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
 * Price channel (PC). This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/price-channel
 *         Price Channel
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/price-channel
 * @optionparent plotOptions.pc
 * @interface Highcharts.PCOptions
 */
export interface PCOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * Option for fill color between lines in Price channel Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @type {Highcharts.Color}
     * @apioption plotOptions.pc.fillColor
     */
    fillColor?: ColorType;
    params?: PCParamsOptions;
    bottomLine?: Record<string, CSSObject>;
    topLine?: Record<string, CSSObject>;
}

export interface PCParamsOptions extends SMAParamsOptions {
    /* *
     *
     *  Excluded
     *
     * */

    index?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default PCOptions;
