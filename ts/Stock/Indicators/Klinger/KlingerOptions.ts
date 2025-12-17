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
 * Klinger oscillator. This series requires the `linkedTo` option to be set
 * and should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/klinger
 *         Klinger oscillator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/klinger
 * @optionparent plotOptions.klinger
 * @interface Highcharts.KlingerOptions
 */
export interface KlingerOptions extends SMAOptions {
    /**
     * Parameters used in calculation of Klinger Oscillator.
     *
     * @excluding index, period
     */
    params?: KlingerParamsOptions;

    /**
     * Styles for a signal line.
     */
    signalLine?: KlingerSignalOptions;
}

export interface KlingerSignalOptions {
    styles?: CSSObject;
}

export interface KlingerParamsOptions extends SMAParamsOptions {
    index?: undefined;

    period?: undefined;

    /**
     * The fast period for indicator calculations.
     */
    fastAvgPeriod: number;

    /**
     * The slow period for indicator calculations.
     */
    slowAvgPeriod: number;

    /**
     * The base period for signal calculations.
     */
    signalPeriod: number;

    /**
     * The id of another series to use its data as volume data for the
     * indiator calculation.
     */
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default KlingerOptions;
