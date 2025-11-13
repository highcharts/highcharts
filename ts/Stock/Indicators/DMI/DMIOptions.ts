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
 * Options for the DMI indicator.
 *
 * @interface Highcharts.DMIOptions
 * @extends Highcharts.SMAOptions
 */
export interface DMIOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * Parameters used in calculation of the DMI values.
     */
    params?: DMIParamsOptions;

    /**
     * Options for the +DI line.
     */
    plusDILine?: DMILineOptions;

    /**
     * Options for the -DI line.
     */
    minusDILine?: DMILineOptions;
}

/**
 * Options for a directional indicator line.
 */
export interface DMILineOptions {
    /**
     * Styles for the line.
     */
    styles?: CSSObject;
}

/**
 * Parameters used in calculation of the DMI values.
 *
 * @interface Highcharts.DMIParamsOptions
 * @extends Highcharts.SMAParamsOptions
 */
export interface DMIParamsOptions extends SMAParamsOptions {
    // For inheritance
}

export default DMIOptions;
