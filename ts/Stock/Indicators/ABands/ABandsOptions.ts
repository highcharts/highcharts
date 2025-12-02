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
 * Acceleration bands (ABANDS). This series requires the `linkedTo` option
 * to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/acceleration-bands
 *         Acceleration Bands
 *
 * @extends      Highcharts.SMAOptions
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/acceleration-bands
 * @optionparent plotOptions.abands
 * @interface Highcharts.ABandsOptions
 */
export interface ABandsOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * Option for fill color between lines in Acceleration bands Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @type {Highcharts.Color}
     * @since 9.3.2
     * @apioption plotOptions.abands.fillColor
     */
    fillColor?: ColorType;

    /**
     * Pixel width of the middle line.
     */
    lineWidth?: number;

    /**
     * Parameters used in calculation of acceleration bands values.
     */
    params?: ABandsParamsOptions;

    /**
     * Options for the bottom line.
     */
    bottomLine?: ABandsLineOptions;

    /**
     * Options for the top line.
     */
    topLine?: ABandsLineOptions;
}

/**
 * Parameters used in calculation of acceleration bands values.
 *
 * @interface Highcharts.ABandsParamsOptions
 * @extends Highcharts.SMAParamsOptions
 */
export interface ABandsParamsOptions extends SMAParamsOptions {
    /**
     * The algorithms factor value used to calculate bands.
     *
     * @product highstock
     */
    factor?: number;
}

/**
 * Options for the top or bottom line.
 *
 * @interface Highcharts.ABandsLineOptions
 */
export interface ABandsLineOptions {
    /**
     * Line specific CSS styles.
     */
    styles?: ABandsLineStyleOptions;
}

/**
 * CSS properties for acceleration bands lines.
 *
 * @interface Highcharts.ABandsLineStyleOptions
 */
export interface ABandsLineStyleOptions extends CSSObject {
    /**
     * Pixel width of the line.
     */
    lineWidth?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ABandsOptions;
