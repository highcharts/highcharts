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
 * Pivot points indicator. This series requires the `linkedTo` option to be
 * set and should be loaded after `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/pivot-points
 *         Pivot points
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/pivot-points
 * @optionparent plotOptions.pivotpoints
 * @interface Highcharts.PivotPointsOptions
 */
export interface PivotPointsOptions extends SMAOptions {
    params?: PivotPointsParamsOptions;
}

export interface PivotPointsParamsOptions extends SMAParamsOptions {
    /**
     * Algorithm used to calculate resistance and support lines based
     * on pivot points. Implemented algorithms: `'standard'`,
     * `'fibonacci'` and `'camarilla'`
     */
    algorithm?: string;

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

export default PivotPointsOptions;
