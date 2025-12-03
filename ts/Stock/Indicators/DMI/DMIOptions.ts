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
 * Directional Movement Index (DMI).
 * This series requires the `linkedTo` option to be set and should
 * be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/dmi
 *         DMI indicator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/dmi
 * @optionparent plotOptions.dmi
 * @interface Highcharts.DMIOptions
 */
export interface DMIOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * @excluding index
     */
    params?: DMIParamsOptions;

    /**
     * +DI line options.
     */
    plusDILine?: Record<string, CSSObject>;

    /**
     * -DI line options.
     */
    minusDILine?: Record<string, CSSObject>;
}

export interface DMIParamsOptions extends SMAParamsOptions {
    // For inheritance
}

export default DMIOptions;
