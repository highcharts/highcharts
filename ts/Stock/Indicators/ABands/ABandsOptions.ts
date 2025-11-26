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
 * Options for the acceleration bands (ABANDS) indicator.
 *
 * @interface Highcharts.ABandsOptions
 * @extends Highcharts.SMAOptions
 */
export interface ABandsOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * Option for fill color between lines in Acceleration bands indicator.
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
     * The algorithm factor value used to calculate bands.
     */
    factor?: number;
}

/**
 * Options for the top or bottom line.
 */
export interface ABandsLineOptions {
    /**
     * Line specific CSS styles.
     */
    styles?: ABandsLineStyleOptions;
}

/**
 * CSS properties for acceleration bands lines.
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
