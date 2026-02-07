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
 * Parabolic SAR. This series requires `linkedTo`
 * option to be set and should be loaded
 * after `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/psar
 *         Parabolic SAR Indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/psar
 * @optionparent plotOptions.psar
 * @interface Highcharts.PSAROptions
 */
export interface PSAROptions extends SMAOptions {
    params?: PSARParamsOptions;
}

export interface PSARParamsOptions extends SMAParamsOptions {
    /**
     * The initial value for acceleration factor.
     * Acceleration factor is starting with this value
     * and increases by specified increment each time
     * the extreme point makes a new high.
     * AF can reach a maximum of maxAccelerationFactor,
     * no matter how long the uptrend extends.
     */
    initialAccelerationFactor?: number;
    /**
     * The Maximum value for acceleration factor.
     * AF can reach a maximum of maxAccelerationFactor,
     * no matter how long the uptrend extends.
     */
    maxAccelerationFactor?: number;
    /**
     * Acceleration factor increases by increment each time
     * the extreme point makes a new high.
     *
     * @since 6.0.0
     */
    increment?: number;
    /**
     * Index from which PSAR is starting calculation
     *
     * @since 6.0.0
     */
    index?: number;
    /**
     * Number of maximum decimals that are used in PSAR calculations.
     *
     * @since 6.0.0
     */
    decimals?: number;

    /* *
     *
     *  Excluded
     *
     * */

    period?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default PSAROptions;
