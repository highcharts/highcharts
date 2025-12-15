/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */

/* *
 *
 *  Imports
 *
 * */

import type CSSObject from '../../../Core/Renderer/CSSObject';
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
 * Aroon. This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/aroon
 *         Aroon
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/aroon
 * @optionparent plotOptions.aroon
 * @interface Highcharts.AroonOptions
 */
export interface AroonOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * AroonDown line options.
     */
    aroonDown?: Record<string, CSSObject>;

    marker?: PointMarkerOptions;

    /**
     * Parameters used in calculation of aroon series points.
     *
     * @excluding index
     */
    params?: AroonParamsOptions;
}

export interface AroonParamsOptions extends SMAParamsOptions {
    index?: undefined;

    period?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AroonOptions;
